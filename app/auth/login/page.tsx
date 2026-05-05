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
    <div className="flex min-h-svh w-full items-center justify-center bg-[#09090b] p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-zinc-800 bg-zinc-950/50 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-zinc-50">
              Welcome back
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEmailSent ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center animate-in fade-in zoom-in duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                  <MailCheck className="h-8 w-8 text-zinc-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-zinc-50">
                    Kiểm tra hộp thư của bạn
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Chúng tôi đã gửi một liên kết đăng nhập đến{" "}
                    <span className="font-semibold text-zinc-200">{email}</span>
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 mt-4"
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

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-zinc-100 text-white hover:bg-zinc-300"
                      disabled={isEmailLoading}
                    >
                      {isEmailLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi link...
                        </>
                      ) : (
                        "Sign in with Email"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0c0c0e] px-2 text-zinc-500 rounded-full">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Sign in with Google */}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full border-zinc-800 bg-zinc-900/50 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50 transition-all"
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
