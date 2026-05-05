import {
  FeaturedArtistsSection,
  HeroSection,
  MoodGenresSection,
  NewReleasesSection,
  TrendingSection,
} from "@/components/features/guest/home";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-10">
        <TrendingSection />

        <MoodGenresSection />

        <NewReleasesSection />

        <FeaturedArtistsSection />
      </div>
    </div>
  );
}
