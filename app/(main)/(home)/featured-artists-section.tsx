import { ArtistCard } from "@/components/artist-card";
import { ScrollSlider } from "@/components/scroll-slider";

import { ArtistService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";

type Props = {};

const FeaturedArtistsSection = async (props: Props) => {
  const supabase = createClient();
  const featuredArtists = await ArtistService.getFeaturedArtists(supabase);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        Nghệ sĩ Nổi bật
      </h2>
      {featuredArtists.length > 0 ? (
        <ScrollSlider>
          {featuredArtists.map((artist) => (
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

export default FeaturedArtistsSection;
