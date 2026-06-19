import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";
import { createServiceClient } from "@/lib/supabase/service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: reportId } = await params;
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { action } = body;

    const supabase = createServiceClient();
    const { data: report, error: fetchErr } = await supabase
      .from("content_report")
      .select("*")
      .eq("id", reportId)
      .single();

    if (fetchErr || !report) {
      return NextResponse.json(
        { error: "Không tìm thấy báo cáo" },
        { status: 404 },
      );
    }

    if (action === "APPROVE") {
      switch (report.target_type) {
        case "TRACK":
          await supabase
            .from("track")
            .update({ is_published: false })
            .eq("id", report.target_id);
          break;

        case "ALBUM":
          await supabase
            .from("album")
            .update({ is_published: false })
            .eq("id", report.target_id);

          await supabase
            .from("track")
            .update({ is_published: false })
            .eq("album_id", report.target_id);
          break;

        case "PLAYLIST":
          await supabase
            .from("playlist")
            .update({ is_public: false })
            .eq("id", report.target_id);
          break;

        case "ARTIST":
          // Bước 1: Khóa hồ sơ nghệ sĩ (Tước quyền xác minh danh tính)
          await supabase
            .from("artist")
            .update({ is_verified: false })
            .eq("id", report.target_id);

          // Bước 2: Truy xuất user_id (Tài khoản gốc) đang liên kết với hồ sơ nghệ sĩ này
          const { data: artistProfile, error: artistErr } = await supabase
            .from("artist")
            .select("user_id")
            .eq("id", report.target_id)
            .single();

          if (artistErr) {
            console.error(
              "[CMS_WARN] Không tìm thấy user_id của nghệ sĩ:",
              artistErr,
            );
            break;
          }

          // Bước 3: Khóa (Ban) hoàn toàn tài khoản người dùng trên hệ thống
          if (artistProfile?.user_id) {
            await supabase
              .from("user")
              .update({ is_locked: true })
              .eq("id", artistProfile.user_id);
          }
          break;

        default:
          console.warn(
            `[CMS_WARN] Hệ thống chưa hỗ trợ khóa loại nội dung: ${report.target_type}`,
          );
          break;
      }
    }

    const { error: updateErr } = await supabase
      .from("content_report")
      .update({
        status: "RESOLVED",
        resolution_action: action,
        resolved_at: new Date().toISOString(),
        resolved_by: auth.user?.id,
      })
      .eq("id", reportId);

    if (updateErr) throw updateErr;

    await supabase.from("admin_audit_log").insert({
      admin_id: auth.user?.id,
      action:
        action === "APPROVE"
          ? "RESOLVE_REPORT_APPROVED"
          : "RESOLVE_REPORT_REJECTED",
      target_id: report.target_id,
      target_name: report.target_name,
      target_type: report.target_type,
      changes: `Báo cáo [${reportId}] đã được ${action}.`,
    });

    return NextResponse.json({ message: "Xử lý thành công" }, { status: 200 });
  } catch (error: any) {
    console.error("[PATCH_RESOLVE_REPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xử lý" },
      { status: 500 },
    );
  }
}
