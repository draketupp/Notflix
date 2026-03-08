import CaroselBanner from "@/components/CaroselBanner";
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

export default async function Home() {
  const nowPlayingMovies = await getNowPlayingMovies();
  const upcomingMovies = await getUpcomingMovies();
  const topRatedMovies = await getTopRatedMovies();
  const popularMovies = await getPopularMovies();

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-40" />
      <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black z-0 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10">
        <CaroselBanner />
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-16 md:space-y-24 pb-24 -mt-16 md:-mt-32">
        {/* Promo Banner */}
        <MotionSection className="relative z-20">
          <PromoBanner />
        </MotionSection>

        {/* Trending Spotlight */}
        {/* <TrendingSpotlight movies={popularMovies} /> */}

        {/* Featured Expandable Showcase */}
        <MotionSection delay={0.2}>
          <FeaturedShowcase movies={topRatedMovies} />
        </MotionSection>

        {/* Genre Spotlight - Action/Adventure */}
        <MotionSection>
          <GenreSpotlight
            title="Action & Adventure"
            description="Explosive action and thrilling adventures await"
            movies={nowPlayingMovies}
            genreId={28}
          />
        </MotionSection>

        {/* Interactive Draggable Carousel - Now Playing */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <InteractiveCarousel movies={nowPlayingMovies} title="Now Playing" />
        </MotionSection>

        {/* Traditional Movie Container - Upcoming */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <MovieContainer movies={upcomingMovies} title="Coming Soon" />
        </MotionSection>

        {/* Genre Spotlight - Drama */}
        <MotionSection>
          <GenreSpotlight
            title="Critically Acclaimed"
            description="Award-winning films and cinematic masterpieces"
            movies={Array.isArray(topRatedMovies) ? topRatedMovies.slice(4, 8) : []}
            genreId={18}
          />
        </MotionSection>

        {/* Interactive Carousel - Top Rated */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <InteractiveCarousel movies={topRatedMovies} title="Top Rated" />
        </MotionSection>

        {/* Traditional Movie Container - Popular */}
        <MotionSection className="container mx-auto px-4 md:px-6">
          <MovieContainer movies={popularMovies} title="Popular Right Now" />
        </MotionSection>
      </div>
    </main>
  );
}
