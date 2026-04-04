"use client";

import { createClient } from "@/lib/supabase/client";
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
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "@/components/icons";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
        redirectTo: `${location.origin}/auth/callback?next=/`,
        queryParams: {
          prompt: 'select_account', 
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
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;

      alert("Đã gửi link đăng nhập! Vui lòng kiểm tra hộp thư của bạn.");
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
            <div className="flex flex-col gap-4">
              {/* Sign in with Email */}
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
                    />
                  </div>
                  
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isEmailLoading}>
                    {isEmailLoading ? 'Logging in...' : 'Sign in with Email'}
                  </Button>
                </div>
              </form>

              {/* Divider: Or continue with */}
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
                className="w-full border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50 transition-all"
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

              {/* Hiển thị lỗi chung */}
              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 text-center border border-red-500/20">
                  {error}
                </div>
              )}
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
