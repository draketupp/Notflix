import { SearchResults } from "../../type"; // Adjust path if needed; assuming Movie type is in here too

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetcher = async <T = SearchResults>(
  endpoint: string,
  params: Record<string, string> = {},
  cacheTime: number = 60 * 60 * 24, // 24 hours default
  page: number = 1
): Promise<T> => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  // Common params
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", page.toString());

  // Add custom params (e.g., with_genres, query, etc.)
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
    },
    next: { revalidate: cacheTime },
  };

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No details");
      console.error(
        `TMDB fetch failed [${response.status}]: ${endpoint} - ${response.statusText} - ${errorText}`
      );
      // Return safe empty/empty object based on expected type
      if (endpoint.includes("/movie/") && endpoint.includes("/videos")) {
        return { results: [] } as T;
      }
      if (endpoint.includes("/movie/") && !endpoint.includes("/videos")) {
        return {} as T;
      }
      return { results: [] } as T;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error(`TMDB fetch error on ${endpoint}:`, error);
    // Safe fallback
    if (endpoint.includes("/movie/") && endpoint.includes("/videos")) {
      return { results: [] } as T;
    }
    if (endpoint.includes("/movie/") && !endpoint.includes("/videos")) {
      return {} as T;
    }
    return { results: [] } as T;
  }
};

export const getNowPlayingMovies = async (page: number = 1) => {
  const data = await fetcher<SearchResults>("/movie/now_playing", {}, 60 * 60 * 24, page);
  return data.results ?? [];
};

export const getUpcomingMovies = async (page: number = 1) => {
  const data = await fetcher<SearchResults>("/movie/upcoming", {}, 60 * 60 * 24, page);
  return data.results ?? [];
};

export const getTopRatedMovies = async (page: number = 1) => {
  const data = await fetcher<SearchResults>("/movie/top_rated", {}, 60 * 60 * 24, page);
  return data.results ?? [];
};

export const getPopularMovies = async (page: number = 1) => {
  const data = await fetcher<SearchResults>("/movie/popular", {}, 60 * 60 * 24, page);
  return data.results ?? [];
};

export const getDiscoverMovies = async (genreId?: string, keywords?: string, page: number = 1) => {
  const params: Record<string, string> = {};
  if (genreId) params.with_genres = genreId;
  if (keywords) params.with_keywords = keywords;
  
  // Optional: Add adult filter if needed
  // params.include_adult = "false";

  const data = await fetcher<SearchResults>("/discover/movie", params, 60 * 60 * 12, page); // 12h cache for discover
  return data.results ?? [];
};

export const getSearchedMovies = async (term: string, page: number = 1) => {
  if (!term.trim()) return [];

  const params = { query: term };
  const data = await fetcher<SearchResults>("/search/movie", params, 60 * 60, page); // 1h cache for search
  return data.results ?? [];
};

export const getMovieVideos = async (id: string) => {
  if (!id) return [];
  const data = await fetcher<{ results: any[] }>("/movie/" + id + "/videos", {}, 60 * 60 * 24);
  return data.results ?? [];
};

export const getMovieDetails = async (id: string) => {
  if (!id) return {};
  const data = await fetcher<any>("/movie/" + id, {}, 60 * 60 * 24);
  return data ?? {};
};
