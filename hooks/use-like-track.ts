import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "./use-auth";
import { TrackService } from "@/lib/services/track.service";
import { createClient } from "@/lib/supabase/client";

export function useLikeTrack(trackId: string) {
  const supabase = createClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !trackId) {
      setIsLiked(false);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchLikeStatus = async () => {
      setIsLoading(true);
      try {
        const status = await TrackService.checkLikeStatus(
          supabase,
          user.id,
          trackId,
        );
        if (isMounted) setIsLiked(status);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái bài hát:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLikeStatus();

    return () => {
      isMounted = false;
    };
  }, [trackId, user?.id]);

  const toggleLike = async () => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    if (!trackId) return;

    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      if (previousState) {
        await TrackService.unlikeTrack(supabase, user.id, trackId);
      } else {
        await TrackService.likeTrack(supabase, user.id, trackId);
        toast.success("Đã thêm vào Bài hát yêu thích");
      }
    } catch (error) {
      setIsLiked(previousState);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return { isLiked, isLoading, toggleLike };
}
