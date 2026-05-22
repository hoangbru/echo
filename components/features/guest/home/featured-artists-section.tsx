import { ArtistCard } from "@/components/shared/cards";
import { ScrollSlider } from "@/components/shared";

import { ArtistService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { Artist } from "@/types";
import { UserStar } from "lucide-react";

type Props = {};

export const FeaturedArtistsSection = async (props: Props) => {
  const supabase = createClient();
  const featuredArtists = await ArtistService.getFeaturedArtists(supabase);

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <UserStar className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Nghệ sĩ nổi bật
        </h2>
      </div>
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
