export interface Post {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  name: string;
  date: string;
  distance: string;
  speed: string;
  elevation: string;
  time: string;
  fit: string;
  expand: {
    user: User;
  };
};

export interface User {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  emailVisibility: boolean
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
};
