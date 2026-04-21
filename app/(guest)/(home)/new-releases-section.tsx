import { ScrollSlider } from "@/components/scroll-slider";
import { TrackCard } from "@/components/track-card";

import { TrackService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";

type Props = {};

const NewReleasesSection = async (props: Props) => {
  const supabase = createClient();
  const newReleases = await TrackService.getNewReleases(supabase);
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        Giai điệu mới nhất
      </h2>
      {newReleases.length > 0 ? (
        <ScrollSlider>
          {newReleases.map((track) => (
            <div key={track.id} className="min-w-[200px] max-w-[240px]">
              <TrackCard track={track} />
            </div>
          ))}
        </ScrollSlider>
      ) : (
        <p className="text-muted-foreground">
          Chưa có bài hát nào trong hệ thống.
        </p>
      )}
    </section>
  );
};

export default NewReleasesSection;
