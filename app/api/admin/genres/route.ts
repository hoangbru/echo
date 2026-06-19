import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";
import { genreSchema } from "@/lib/validations/genre.schema";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error || !auth.user?.id) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
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
    const supabaseAdmin = createServiceClient();

    const { data: newGenre, error } = await supabaseAdmin
      .from("genre")
      .insert({
        name: safeData.name,
        description: safeData.description || null,
        icon: body.icon || null,
        color: body.color || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[DB_ERROR_INSERT_GENRE]:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Tên thể loại này đã tồn tại" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Không thể thêm thể loại mới" },
        { status: 500 },
      );
    }

    await supabaseAdmin.from("admin_audit_log").insert({
      admin_id: auth.user.id,
      action: "CREATE_GENRE",
      target_id: newGenre.id,
      target_name: newGenre.name,
      target_type: "GENRE",
      changes: `Admin đã thêm thể loại nhạc mới: ${newGenre.name}`,
    });

    return NextResponse.json(
      { data: newGenre, message: "Thêm thể loại thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST_ADMIN_GENRE_FATAL]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
