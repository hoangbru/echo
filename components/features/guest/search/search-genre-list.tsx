import { GenreCard } from "@/components/shared/cards";

import { Genre } from "@/types";

interface SearchGenreListProps {
  genres: Genre[];
}

export function SearchGenreList({ genres }: SearchGenreListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {genres.length > 0 ? (
        genres.map((genre: Genre) => (
          <GenreCard key={genre.icon} genre={genre} />
        ))
      ) : (
        <p className="text-muted-foreground">Không tìm thấy thể loại phù hợp</p>
      )}
    </div>
  );
}
