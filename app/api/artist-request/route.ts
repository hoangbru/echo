import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { artistRequestSchema } from "@/lib/validations/artist-request.schema";
import { ArtistRequestStatus, UserRole } from "@/types";
import { keysToCamel } from "@/lib/utils/format";
import {
  audioFileSchema,
  imageFileSchema,
} from "@/lib/validations/file.schema";
import { uploadFileToSupabase } from "@/lib/utils/file";
import { removeVietnameseTones } from "@/lib/utils/utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const auth = await authorizeApi([UserRole.ADMIN]);

    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let query = supabase.from("artist_request").select("*", { count: "exact" });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (fromDate) {
      query = query.gte("created_at", fromDate);
    }

    if (toDate) {
      query = query.lte("created_at", toDate);
    }

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.or(
        `stage_name.ilike.%${search}%,contact_email.ilike.%${search}%`,
      );
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw new Error("Đã có lỗi xảy ra");

    const formattedData = keysToCamel(data || []);
    return NextResponse.json(
      {
        data: formattedData,
        meta: {
          totalCount: count || 0,
          page,
          limit,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  let uploadedAudioPath: string | null = null;
  let uploadedImagePath: string | null = null;

  try {
    const auth = await authorizeApi();

    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const formData = await request.formData();
    const userId = auth.user?.id;

    const rawData = {
      stageName: formData.get("stageName") as string,
      bio: formData.get("bio") as string,
      contactEmail: formData.get("contactEmail") as string,
      agreedToTerms: formData.get("agreedToTerms") === "true",
      facebook: (formData.get("facebook") as string) || "",
      instagram: (formData.get("instagram") as string) || "",
      youtube: (formData.get("youtube") as string) || "",
    };

    const validatedData = artistRequestSchema.safeParse(rawData);
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const safeData = validatedData.data;

    const audioFile = formData.get("demoAudioFile") as File | null;
    const audioValidation = audioFileSchema.safeParse(audioFile);
    if (!audioValidation.success) {
      return NextResponse.json(
        { error: audioValidation.error.errors[0].message },
        { status: 400 },
      );
    }
    const validAudio = audioValidation.data;

    let validImage = null;
    const imageFile = formData.get("profileImageFile") as File | null;
    if (imageFile && imageFile.size > 0) {
      const imageValidation = imageFileSchema.safeParse(imageFile);
      if (!imageValidation.success) {
        return NextResponse.json(
          { error: imageValidation.error.errors[0].message },
          { status: 400 },
        );
      }
      validImage = imageValidation.data;
    }

    const {
      url: audioUrl,
      path: aPath,
      error: audioErr,
    } = await uploadFileToSupabase(
      supabase,
      validAudio,
      "audio",
      `requests/${userId}`,
    );
    if (audioErr) {
      return NextResponse.json(
        { error: "Không thể tải lên file âm thanh" },
        { status: 400 },
      );
    }
    uploadedAudioPath = aPath;

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const {
        url: imgUrl,
        path: iPath,
        error: imgErr,
      } = await uploadFileToSupabase(
        supabase,
        imageFile,
        "covers",
        `requests/${userId}`,
      );
      if (imgErr)
        return NextResponse.json(
          { error: "Không thể tải lên ảnh đại diện" },
          { status: 400 },
        );
      imageUrl = imgUrl || "";
      uploadedImagePath = iPath;
    }

    const socialLinks = {
      facebook: safeData.facebook || "",
      instagram: safeData.instagram || "",
      youtube: safeData.youtube || "",
    };

    const dbData: any = {
      user_id: userId,
      stage_name: safeData.stageName,
      bio: safeData.bio,
      social_links: socialLinks,
      contact_email: safeData.contactEmail,
      demo_link: audioUrl,
      profile_image: imageUrl,
      agreed_to_terms: safeData.agreedToTerms,
      status: ArtistRequestStatus.PENDING,
    };

    const { error } = await supabase.from("artist_request").insert(dbData);

    if (error)
      return NextResponse.json(
        { error: "Gửi yêu cầu không thành công!" },
        { status: 400 },
      );

    return NextResponse.json(
      { message: "Gửi yêu cầu thành công!" },
      { status: 200 },
    );
  } catch (error: any) {
    if (uploadedAudioPath)
      await supabase.storage.from("audio").remove([uploadedAudioPath]);
    if (uploadedImagePath)
      await supabase.storage.from("covers").remove([uploadedImagePath]);

    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient();

  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();

    if (body.status === ArtistRequestStatus.APPROVED) {
      const { error: artistError } = await supabase.from("artist").insert({
        user_id: body.user_id,
        stage_name: body.stage_name,
        bio: body.bio,
        social_links: body.social_links,
        contact_email: body.contact_email,
        profile_image: body.profile_image,
      });

      if (artistError) {
        return NextResponse.json(
          { error: "Lỗi khi khởi tạo dữ liệu Nghệ sĩ" },
          { status: 400 },
        );
      }
    }

    const { error: requestError } = await supabase
      .from("artist_request")
      .update({
        status: body.status,
        review_comment:
          body.status === ArtistRequestStatus.APPROVED
            ? "Hồ sơ hợp lệ. Chào mừng bạn đến với hệ thống Nghệ sĩ Echo!"
            : body.review_comment,
        reviewed_at: new Date().toISOString(),
        reviewed_by: body.reviewed_by,
      })
      .eq("id", body.id);

    if (requestError)
      return NextResponse.json(
        { error: "Không thể cập nhật trạng thái đơn yêu cầu" },
        { status: 400 },
      );

    let message = "Đã cập nhật trạng thái yêu cầu!";

    switch (body.status) {
      case ArtistRequestStatus.APPROVED:
        message = "Đã chấp nhận đơn yêu cầu!";
        break;
      case ArtistRequestStatus.REJECTED:
        message = "Đã từ chối đơn yêu cầu!";
        break;
      default:
        break;
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
