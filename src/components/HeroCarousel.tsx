"use client";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { Movie } from "../../type";
import Image from "next/image";
import { getImagePath } from "@/lib/getImagePath";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { useState, useEffect } from "react";
import TrailerModal from "./TrailerModal";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import Link from "next/link";

interface Props {
  movies: Movie[];
}

const HeroCarousel = ({ movies }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoPlay({ delay: 8000, stopOnInteraction: false })],
  );

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onAutoplayTimeLeft = (
      emblaApi: any,
      timeLeft: number,
      timeToNext: number,
    ) => {
      setProgress(1 - timeLeft / timeToNext);
    };

    emblaApi.on("autoplay:timenext" as any, onAutoplayTimeLeft as any);

    return () => {
      emblaApi.off("autoplay:timenext" as any, onAutoplayTimeLeft as any);
    };
  }, [emblaApi]);

  const [movieVideos, setMovieVideos] = useState<{ [key: number]: any[] }>({});

  // Fetch videos for all hero movies
  useEffect(() => {
    const fetchAllVideos = async () => {
      const videoPromises = movies.slice(0, 5).map(async (movie) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          );
          const data = await response.json();
          return { movieId: movie.id, videos: data.results || [] };
        } catch (error) {
          console.error(`Error fetching videos for movie ${movie.id}:`, error);
          return { movieId: movie.id, videos: [] };
        }
      });

      const results = await Promise.all(videoPromises);
      const videosMap: { [key: number]: any[] } = {};
      results.forEach(({ movieId, videos }) => {
        videosMap[movieId] = videos;
      });
      setMovieVideos(videosMap);
    };

    if (movies.length > 0) {
      fetchAllVideos();
    }
  }, [movies]);

  const getTrailer = (movieId: number) => {
    const videos = movieVideos[movieId] || [];
    // Prioritize Trailer, then Teaser, then any YouTube video
    return (
      videos.find(
        (video) => video.type === "Trailer" && video.site === "YouTube",
      ) ||
      videos.find(
        (video) => video.type === "Teaser" && video.site === "YouTube",
      ) ||
      videos.find((video) => video.site === "YouTube")
    );
  };

  return (
    <div className="relative w-full group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {(movies ?? []).slice(0, 5).map((movie) => {
            // your existing map code...
            const trailer = getTrailer(movie.id);
            // etc.
          })}
        </div>
            return (
              <div key={movie?.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="relative aspect-video w-full">
                  <Image
                    src={getImagePath(movie?.backdrop_path, true)}
                    alt={movie?.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                  {/* linear Overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/20 to-black/10 dark:from-background dark:via-background/15 dark:to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-r dark:from-background dark:via-background/10 dark:to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-6">
                      <div className="max-w-2xl space-y-4">
                        <TextGenerateEffect
                          words={movie?.title}
                          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"
                        />
                        <p className="text-sm md:text-base lg:text-lg text-white/90 line-clamp-3 drop-shadow-md">
                          {movie?.overview}
                        </p>
                        <div className="flex gap-3 pt-2">
                          {trailer ? (
                            <TrailerModal
                              videoKey={trailer.key}
                              title={`${movie.title} - Trailer`}
                              trigger={
                                <Button size="lg" className="gap-2">
                                  <Play
                                    className="h-5 w-5"
                                    fill="currentColor"
                                  />
                                  Play
                                </Button>
                              }
                            />
                          ) : (
                            <Button size="lg" className="gap-2" disabled>
                              <Play className="h-5 w-5" fill="currentColor" />
                              Play
                            </Button>
                          )}
                          <Button
                            size="lg"
                            variant="outline"
                            className="gap-2 bg-background/80 backdrop-blur hover:bg-background/90"
                            asChild
                          >
                            <Link href={`/movie/${movie.id}`}>
                              <Info className="h-5 w-5" />
                              More Info
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-primary/80 transition-all duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;
