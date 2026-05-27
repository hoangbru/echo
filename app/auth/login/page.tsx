"use client";

import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=/`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Lỗi kết nối Google.");
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }

    setIsEmailLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });
      if (error) throw error;

      setIsEmailSent(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Chào mừng trở lại
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Nhập email của bạn để đăng nhập vào tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEmailSent ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center animate-in fade-in zoom-in duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sidebar-background border border-border">
                  <MailCheck className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Kiểm tra hộp thư của bạn
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi đã gửi một liên kết đăng nhập đến{" "}
                    <span className="font-semibold text-foreground">
                      {email}
                    </span>
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-border bg-transparent text-foreground hover:bg-white/5 mt-4"
                  onClick={() => setIsEmailSent(false)}
                >
                  Thử lại với email khác
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <form onSubmit={handleEmailLogin}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@vidu.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-[#FF47A3] font-semibold"
                      disabled={isEmailLoading}
                    >
                      {isEmailLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi link...
                        </>
                      ) : (
                        "Đăng nhập bằng Email"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground rounded-full">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                {/* Sign in with Google */}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full border-border bg-background text-foreground hover:bg-white/5 transition-all font-semibold"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="mr-2 h-4 w-4" />
                  )}
                  Google
                </Button>

                {error && !isEmailLoading && (
                  <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 text-center border border-red-500/20 mt-2">
                    {error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
