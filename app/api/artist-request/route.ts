import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { artistRequestSchema } from "@/lib/validations/artist-request.schema";
import { ArtistRequestStatus, UserRole } from "@/types";
import { keysToCamel } from "@/lib/utils/format";

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

    let query = supabase
      .from("artist_request")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status === ArtistRequestStatus.APPROVED)
      query = query.eq("status", "APPROVED");
    if (status === ArtistRequestStatus.PENDING)
      query = query.eq("status", "PENDING");
    if (status === ArtistRequestStatus.REJECTED)
      query = query.eq("status", "REJECTED");

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const auth = await authorizeApi();

    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();

    const validatedData = artistRequestSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 },
      );
    }
    const safeData = validatedData.data;

    const socialLinks = {
      facebook: safeData.facebook || "",
      instagram: safeData.instagram || "",
      youtube: safeData.youtube || "",
    };

    const dbData: any = {
      user_id: auth.user?.id,
      stage_name: safeData.stageName,
      bio: safeData.bio,
      social_links: socialLinks,
      status: ArtistRequestStatus.PENDING,
      contact_email: safeData.contactEmail,
      demo_link: safeData.demoLink,
      profile_image: safeData.profileImage,
      agreed_to_terms: safeData.agreedToTerms,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
          { error: "Lỗi khi khởi tạo dữ liệu Nghệ sĩ"},
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
