"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";
import { usePlayer } from "@/hooks/use-player";
import { useAuth } from "@/hooks/use-auth";

interface LikeButtonProps {}

export function LikeButton({}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const { user } = useAuth();
  const { currentTrack } = usePlayer();

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const checkLikeStatus = async () => {
      const { data } = await supabase
        .from("liked_tracks")
        .select("track_id")
        .eq("user_id", user?.id)
        .eq("track_id", currentTrack?.id)
        .single();

      if (data) setIsLiked(true);
      setIsLoading(false);
    };

    checkLikeStatus();
  }, [currentTrack?.id, user?.id, supabase]);

  const toggleLike = async () => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      if (previousState) {
        const { error } = await supabase
          .from("liked_tracks")
          .delete()
          .match({ user_id: user?.id, track_id: currentTrack?.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("liked_tracks")
          .insert({ user_id: user?.id, track_id: currentTrack?.id });
        if (error) throw error;
        toast.success("Đã thêm vào Bài hát yêu thích");
      }
    } catch (error) {
      setIsLiked(previousState);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className="p-2 transition-all hover:scale-110 disabled:opacity-50"
      title={isLiked ? "Bỏ yêu thích" : "Yêu thích"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors duration-200",
          isLiked
            ? "fill-primary text-primary"
            : "text-gray-400 hover:text-white",
        )}
      />
    </button>
  );
}
