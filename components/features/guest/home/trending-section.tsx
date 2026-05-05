import { Flame } from "lucide-react";

import { ScrollSlider } from "@/components/shared/scroll-slider";
import { AlbumCard } from "@/components/shared/cards/album-card";

import { AlbumService } from "@/lib/services";
import { Album } from "@/types";
import { createClient } from "@/lib/supabase/server";

type Props = {};

export async function TrendingSection(props: Props) {
  const supabase = createClient();
  const trending = await AlbumService.getTrending(supabase);
  
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
