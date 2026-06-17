import { Radio } from "lucide-react";

import { GenreCard } from "@/components/shared/cards";

import { GenreService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { Genre } from "@/types";

type Props = {};

export async function MoodGenresSection(props: Props) {
  const supabase = createClient();
  const genres = await GenreService.getGenres(supabase);

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Radio className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Tâm trạng & Thể loại
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {genres.length > 0 ? (
          genres.map((genre: Genre) => (
            <GenreCard key={genre.icon} genre={genre} />
          ))
        ) : (
          <p className="text-muted-foreground">
            Không tìm thấy thể loại phù hợp
          </p>
        )}
      </div>
    </section>
  );
}
