import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

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

  const { data: dbAdmin } = await supabase
    .from("User")
    .select("role, fullName, avatar, username, email") 
    .eq("id", user.id)
    .single();

  if (!dbAdmin || dbAdmin.role !== "ADMIN") {
    redirect("/403");
  }

  const adminProfile = {
    fullName: dbAdmin.fullName || dbAdmin.username || "Quản trị viên",
    avatar: dbAdmin.avatar || null,
    email: dbAdmin.email || user.email,
  };

  // 5. Truyền adminProfile vào AdminShell
  return <AdminShell adminProfile={adminProfile}>{children}</AdminShell>;
}
