import { ScrollSlider } from "@/components/scroll-slider";
import { AlbumCard } from "@/components/album-card";

import { AlbumService } from "@/lib/services";
import { Album } from "@/types";
import { createClient } from "@/lib/supabase/server";

type Props = {};

export default async function NewReleasesSection(props: Props) {
  const supabase = createClient();
  const newReleases = await AlbumService.getNewReleases(supabase);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        Giai điệu mới nhất
      </h2>
      {newReleases.length > 0 ? (
        <ScrollSlider>
          {newReleases.map((al: Album) => (
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
