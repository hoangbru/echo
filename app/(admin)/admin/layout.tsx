import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { UserService } from "@/lib/services";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin-login");

  const dbAdmin = await UserService.getUserProfile(
    supabase,
    user.id,
    "role, full_name, avatar, username, email",
  );

  if (!dbAdmin || dbAdmin.role !== "ADMIN") {
    redirect("/403");
  }

  const adminProfile = {
    fullName: dbAdmin.fullName || dbAdmin.username || "Quản trị viên",
    avatar: dbAdmin.avatar || null,
    email: dbAdmin.email || user.email,
  };

  return <AdminShell adminProfile={adminProfile}>{children}</AdminShell>;
}
