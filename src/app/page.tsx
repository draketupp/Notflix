import CarouselBanner from "@/components/CarouselBanner"; // Fixed potential typo: Carosel → Carousel
import MovieContainer from "@/components/MovieContainer";
import PromoBanner from "@/components/PromoBanner";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import InteractiveCarousel from "@/components/InteractiveCarousel";
import GenreSpotlight from "@/components/GenreSpotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import MotionSection from "@/components/animations/MotionSection";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/getMovies";

// Optional: Define a Movie type if not already in typings
// type Movie = { id: number; title: string; poster_path?: string; backdrop_path?: string; /* etc */ };

export default async function Home() {
  // Fetch all data in parallel for better perf + handle errors gracefully
  const [
    nowPlayingMovies = [],
    upcomingMovies = [],
    topRatedMovies = [],
    popularMovies = [],
  ] = await Promise.all([
    getNowPlayingMovies().catch(() => []),
    getUpcomingMovies().catch(() => []),
    getTopRatedMovies().catch(() => []),
    getPopularMovies().catch(() => []),
  ]);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0 pointer-events-none" />

      {/* Hero Section – This often breaks first; fallback to empty if no data */}
      <div className="relative z-10">
        <CarouselBanner movies={nowPlayingMovies ?? []} /> {/* Pass safe array; adjust prop if component expects different data */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-16 md:space-y-24 pb-24 -mt-16 md:-mt-32">
        {/* Promo Banner */}
        <MotionSection className="relative z-20">
          <PromoBanner />
        </MotionSection>

        {/* Featured Expandable Showcase – Safe fallback */}
        <MotionSection delay={0.2}>
          <FeaturedShowcase movies={topRatedMovies ?? []} />
        </MotionSection>

        {/* Genre Spotlight - Action/Adventure */}
        <MotionSection>
          <GenreSpotlight
            title="Action & Adventure"
            description="Explosive action and thrilling adventures await"
            movies={nowPlayingMovies ?? []}
            genreId={28}
          />
        </MotionSection>

        {/* Interactive Draggable Carousel - Now Playing */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <InteractiveCarousel movies={nowPlayingMovies ?? []} title="Now Playing" />
        </MotionSection>

        {/* Traditional Movie Container - Upcoming */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <MovieContainer movies={upcomingMovies ?? []} title="Coming Soon" />
        </MotionSection>

        {/* Genre Spotlight - Drama / Critically Acclaimed – Already had slice safeguard; improved */}
        <MotionSection>
          <GenreSpotlight
            title="Critically Acclaimed"
            description="Award-winning films and cinematic masterpieces"
            movies={(topRatedMovies ?? []).slice(4, 8)} // Safe: slice on array or empty
            genreId={18}
          />
        </MotionSection>

        {/* Interactive Carousel - Top Rated */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <InteractiveCarousel movies={topRatedMovies ?? []} title="Top Rated" />
        </MotionSection>

        {/* Traditional Movie Container - Popular */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <MovieContainer movies={popularMovies ?? []} title="Popular Right Now" />
        </MotionSection>
      </div>
    </main>
  );
}
