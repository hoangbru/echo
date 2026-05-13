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
import { removeVietnameseTones } from "@/lib/utils/helpers";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const auth = await authorizeApi([UserRole.ADMIN]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

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
        `stage_name_search.ilike.%${cleanSearch}%,contact_email.ilike.%${search}%`,
      );
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("[GET_ARTIST_REQUESTS_DB_ERROR]:", error);
      return NextResponse.json(
        { error: "Không thể tải danh sách yêu cầu lúc này" },
        { status: 500 },
      );
    }

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
    console.error("[GET_ARTIST_REQUESTS_FATAL_ERROR]:", error);
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

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

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
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 },
      );
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
      console.error("[STORAGE_DEMO_AUDIO_ERROR]:", audioErr);
      return NextResponse.json(
        { error: "Không thể tải lên file âm thanh" },
        { status: 500 },
      );
    }
    uploadedAudioPath = aPath;

    let imageUrl = "";
    if (validImage) {
      const {
        url: imgUrl,
        path: iPath,
        error: imgErr,
      } = await uploadFileToSupabase(
        supabase,
        validImage,
        "covers",
        `requests/${userId}`,
      );
      if (imgErr) {
        console.error("[STORAGE_PROFILE_IMAGE_ERROR]:", imgErr);
        if (uploadedAudioPath)
          await supabase.storage.from("audio").remove([uploadedAudioPath]);
        return NextResponse.json(
          { error: "Không thể tải lên ảnh đại diện" },
          { status: 500 },
        );
      }
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

    const { error: dbError } = await supabase
      .from("artist_request")
      .insert(dbData);

    if (dbError) {
      console.error("[DB_INSERT_ARTIST_REQUEST_ERROR]:", dbError);

      if (uploadedAudioPath)
        await supabase.storage.from("audio").remove([uploadedAudioPath]);
      if (uploadedImagePath)
        await supabase.storage.from("covers").remove([uploadedImagePath]);

      return NextResponse.json(
        { error: "Gửi yêu cầu không thành công" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Gửi yêu cầu thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST_ARTIST_REQUEST_FATAL_ERROR]:", error);
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
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const currentUserId = auth.user?.id;

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
        console.error("[PATCH_ARTIST_INSERT_ERROR]", artistError);
        return NextResponse.json(
          { error: "Lỗi khi khởi tạo dữ liệu Nghệ sĩ" },
          { status: 400 },
        );
      }

      console.log(
        `Updating user ${body.user_id} to ARTIST role and premium status...`,
      );
      const { error: userError } = await supabaseAdmin
        .from("user")
        .update({ is_premium: true, role: UserRole.ARTIST })
        .eq("id", body.user_id);

      if (userError) {
        console.error("[PATCH_USER_ROLE_UPDATE_ERROR]", userError);
        await supabaseAdmin.from("artist").delete().eq("user_id", body.user_id);
        return NextResponse.json(
          { error: "Lỗi khi cập nhật phân quyền người dùng" },
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
            ? "Hồ sơ hợp lệ Chào mừng bạn đến với hệ thống Nghệ sĩ Echo"
            : body.review_comment,
        reviewed_at: new Date().toISOString(),
        reviewed_by: currentUserId,
      })
      .eq("id", body.id);

    if (requestError) {
      console.error("[PATCH_REQUEST_UPDATE_ERROR]", requestError);
      if (body.status === ArtistRequestStatus.APPROVED) {
        await supabase
          .from("user")
          .update({ role: UserRole.USER })
          .eq("id", body.user_id);
        await supabase.from("artist").delete().eq("user_id", body.user_id);
      }
      return NextResponse.json(
        { error: "Không thể cập nhật trạng thái đơn yêu cầu" },
        { status: 400 },
      );
    }

    let message = "Đã cập nhật trạng thái yêu cầu";

    switch (body.status) {
      case ArtistRequestStatus.APPROVED:
        message = "Đã chấp nhận đơn yêu cầu";
        break;
      case ArtistRequestStatus.REJECTED:
        message = "Đã từ chối đơn yêu cầu";
        break;
      default:
        break;
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    console.error("[PATCH_ARTIST_REQUEST_FATAL_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
