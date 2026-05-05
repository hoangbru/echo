import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genreSchema } from "@/lib/validations/genre.schema";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let query = supabase
      .from("genre")
      .select("id, name, description")
      .order("name", { ascending: true });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
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
      if (error.code === "23505") {
        throw new Error("Tên thể loại này đã tồn tại!");
      }
      throw new Error(error.message);
    }

    return NextResponse.json(
      { data: newGenre, message: "Thêm thể loại thành công!" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
