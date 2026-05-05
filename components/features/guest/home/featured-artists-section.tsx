import { ArtistCard } from "@/components/shared/cards";
import { ScrollSlider } from "@/components/shared";

import { ArtistService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { Artist } from "@/types";

type Props = {};

export const FeaturedArtistsSection = async (props: Props) => {
  const supabase = createClient();
  const featuredArtists = await ArtistService.getFeaturedArtists(supabase);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        Nghệ sĩ Nổi bật
      </h2>
      {featuredArtists.length > 0 ? (
        <ScrollSlider>
          {featuredArtists.map((artist: Artist) => (
            <div key={artist.id} className="min-w-[200px] max-w-[240px]">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </ScrollSlider>
      ) : (
        <p className="text-muted-foreground">
          Chưa có nghệ sĩ nào trong hệ thống.
        </p>
      )}
    </section>
  );
};
