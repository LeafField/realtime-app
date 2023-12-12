export type Profile = {
  id: string | undefined;
  updated_at: string;
  created_at: string;
  username: string | undefined;
  avatarUrl: string | undefined;
  favorites: string | undefined;
};

export type EditedProfile = {
  username: string | undefined;
  avatarUrl: string | undefined;
  favorites: string | undefined;
};
