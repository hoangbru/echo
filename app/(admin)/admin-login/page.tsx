"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError("Email hoặc mật khẩu không chính xác.");
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { data: dbUser } = await supabase
        .from("User")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (dbUser?.role !== "ADMIN") {
        await supabase.auth.signOut();
        setError("Tài khoản này không có quyền Quản trị viên!");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#09090b] p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-50">
              Cổng đăng nhập dành cho Quản trị viên
            </CardTitle>
            <CardDescription className="text-sm text-zinc-400">
              Nhập email của bạn để đăng nhập vào tài khoản Quản trị viên.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <form onSubmit={handleAdminLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-zinc-100 text-white hover:bg-zinc-300"
                    disabled={loading}
                  >
                    {loading ? "Đang xác thực..." : "Đăng nhập Hệ thống"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
