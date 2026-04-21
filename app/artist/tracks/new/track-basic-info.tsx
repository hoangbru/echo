import { UseFormReturn } from "react-hook-form";
import { TrackFormValues } from "@/lib/validations/track.schema";
import { AlbumCard, GenreDB } from "@/types";
import { AlbumSelector } from "./album-selector";

interface Props {
  form: UseFormReturn<TrackFormValues>;
  albums: AlbumCard[];
  genres: GenreDB[];
}

export function TrackBasicInfo({ form, albums, genres }: Props) {
  const { register, watch, setValue } = form;
  const selectedAlbumId = watch("album_id");

  return (
    <div className="bg-card p-8 rounded-2xl border border-white/10 space-y-6">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Tiêu đề bài hát *
        </label>
        <input
          {...register("title")}
          className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <AlbumSelector
        albums={albums}
        selectedAlbumId={selectedAlbumId}
        onSelect={(id) => setValue("album_id", id)}
      />

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Thể loại
        </label>
        <select
          {...register("genre_id")}
          className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"
        >
          <option value="">Chọn thể loại</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
