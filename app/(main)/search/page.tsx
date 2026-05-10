import { SearchContainer } from "@/components/features/guest/search";

import { GenreService } from "@/lib/services";
import { createClient } from "@/lib/supabase/client";

export const metadata = {
  title: "Tìm kiếm - Echo",
};

export default async function SearchPage() {
  const supabase = createClient();
  const genres = await GenreService.getGenres(supabase);

  return <SearchContainer genres={genres} />;
}
