export interface Season {
  uid: string;
  title: string;
  series: {
    uid: string;
    title: string;
  };
  seasonNumber?: number;
  numberOfEpisodes: number | null;
}

export interface SeasonDetails extends Season {
  episodes?: Array<{
    uid: string;
    title: string;
    episodeNumber: number;
  }>;
}
