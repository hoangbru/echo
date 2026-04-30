import { GenreService } from "@/lib/services";
import { Genre } from "@/types";
import { Radio } from "lucide-react";
import IconComponent from "@/components/icon-component";
import { createClient } from "@/lib/supabase/server";

type Props = {};

export default async function MoodGenresSection(props: Props) {
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
            <div
              key={genre.id}
              className="h-28 rounded-lg p-4 flex items-start justify-start cursor-pointer hover:scale-105 transition-all duration-300 shadow-md relative overflow-hidden group"
              style={{
                background: genre.color
                  ? `linear-gradient(135deg, ${genre.color} 0%, rgba(0,0,0,0.4) 150%)`
                  : "#18181b",
              }}
            >
              <span className="font-bold text-white text-xl drop-shadow-lg z-10">
                {genre.name}
              </span>

              <div className="absolute -right-4 -bottom-4 text-white opacity-20 transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
                <IconComponent
                  name={genre.icon || "Music"}
                  className="w-20 h-20"
                />
              </div>
            </div>
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
