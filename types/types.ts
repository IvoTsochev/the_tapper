export type UserType = {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  user_id: string;
};

export type LeaderboardType = {
  id: number;
  created_at: string;
  user_id: string;
  username: string;
  taps: number;
};
