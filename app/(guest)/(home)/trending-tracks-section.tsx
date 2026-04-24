import { Flame } from "lucide-react";

import { ScrollSlider } from "@/components/scroll-slider";
import { TrackCard } from "@/components/track-card";

import { TrackService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { Track } from "@/types";

type Props = {};

const TrendingTracksSection = async (props: Props) => {
  const supabase = createClient();
  const { data: trendingTracks, error } =
    await TrackService.getTrendingTracks(supabase);

  if (error) {
    return "Không thể tải danh sách bài hát, vui lòng thử lại sau!";
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Thịnh hành hiện tại
        </h2>
      </div>
      {trendingTracks.length > 0 ? (
        <ScrollSlider>
          {trendingTracks.map((track: Track) => (
            <div key={track.id} className="min-w-[200px] max-w-[240px]">
              <TrackCard track={track} />
            </div>
          ))}
        </ScrollSlider>
      ) : (
        <p className="text-muted-foreground">
          Chưa có bài hát nào trong hệ thống.
        </p>
      )}
    </section>
  );
};

export default TrendingTracksSection;
