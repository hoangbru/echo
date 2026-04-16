
import { Sparkles } from "lucide-react";

import { PlayAllButton } from "@/components/play-all-button";
import { TrackService } from "@/lib/services";

type Props = {};

const HeroSection = async(props: Props) => {
  const trendingTracks = await TrackService.getTrendingTracks();

  return (
    <div className="relative bg-gradient-to-b from-primary/20 to-background p-8 md:p-12 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4 text-primary font-medium">
            <Sparkles className="w-5 h-5" />
            <span>Dành riêng cho bạn</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground tracking-tight">
            Khám phá không gian <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">
              Âm nhạc của Echo
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Thưởng thức các bài hát thịnh hành, nghệ sĩ nổi bật và những giai
            điệu phù hợp nhất với tâm trạng của bạn ngay hôm nay.
          </p>
          <PlayAllButton tracks={trendingTracks} />
        </div>

        {/* Banner Image */}
        <div className="hidden md:block w-72 h-72 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,26,140,0.3)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent z-10 mix-blend-overlay" />
          <img
            src="/placeholder-hero.jpg"
            alt="Featured"
            className="w-full h-full object-cover bg-card"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
