import { NextRequest, NextResponse } from "next/server";
import { genreSchema } from "@/lib/validations/genre.schema";
import { createClient } from "@/lib/supabase/server";
import { removeVietnameseTones } from "@/lib/utils/utils";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("q") || searchParams.get("search") || "";

    let query = supabase
      .from("genre")
      .select("id, name, description")
      .order("name", { ascending: true });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("name", `%${cleanSearch}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[DB_ERROR_GET_GENRES]:", error.message);
      return NextResponse.json(
        { error: "Không thể tải danh sách thể loại lúc này" },
        { status: 500 },
      );
    }

    const formattedData = keysToCamel(data);
    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_GENRES_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const validatedData = genreSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 },
      );
    }

    const safeData = validatedData.data;

    const { data: newGenre, error } = await supabase
      .from("genre")
      .insert({
        name: safeData.name,
        description: safeData.description || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[DB_ERROR_INSERT_GENRE]:", error);
      return NextResponse.json(
        { error: "Không thể thêm thể loại mới" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { data: newGenre, message: "Thêm thể loại thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST_GENRE_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
