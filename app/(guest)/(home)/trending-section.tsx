import { Flame } from "lucide-react";

import { ScrollSlider } from "@/components/scroll-slider";
import { AlbumCard } from "@/components/album-card";

import { AlbumService } from "@/lib/services";
import { Album } from "@/types";

type Props = {};

export default async function TrendingSection(props: Props) {
  const trending = await AlbumService.getTrending();
  
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Thịnh hành
        </h2>
      </div>
      {trending.length > 0 ? (
        <ScrollSlider>
          {trending.map((al: Album) => (
            <div key={al.id} className="min-w-[200px] max-w-[240px]">
              <AlbumCard album={al} />
            </div>
          ))}
        </ScrollSlider>
      ) : (
        <p className="text-muted-foreground">Không tìm được album phù hợp</p>
      )}
    </section>
  );
}
