import MoodGenresSection from "./mood-genres-section";
import NewReleasesSection from "./new-releases-section";
import TrendingTracksSection from "./trending-tracks-section";
import FeaturedArtistsSection from "./featured-artists-section";
import HeroSection from "./hero-section";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-10">
        {/* Section 1: Trending Tracks */}
        <TrendingTracksSection />

        {/* Section 2: Mood & Genres */}
        <MoodGenresSection />

        {/* Section 3: New Releases */}
        <NewReleasesSection />

        {/* Section 4: Featured Artists */}
        <FeaturedArtistsSection />
      </div>
    </div>
  );
}
