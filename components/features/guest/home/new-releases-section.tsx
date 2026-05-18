import { ScrollSlider } from "@/components/shared/scroll-slider";
import { AlbumCard } from "@/components/shared/cards/album-card";

import { AlbumService } from "@/lib/services";
import { AlbumDetail } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { Newspaper } from "lucide-react";

type Props = {};

export async function NewReleasesSection(props: Props) {
  const supabase = createClient();
  const newReleases = await AlbumService.getNewReleases(supabase);

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Mới phát hành
        </h2>
      </div>
      {newReleases.length > 0 ? (
        <ScrollSlider>
          {newReleases.map((al: AlbumDetail) => (
            <div key={al.id} className="min-w-[200px] max-w-[240px]">
              <AlbumCard album={al} />
            </div>
          ))}
        </ScrollSlider>
      ) : (
        <p className="text-muted-foreground">Không tìm thấy album phù hợp</p>
      )}
    </section>
  );
}
