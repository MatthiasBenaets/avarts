export interface Post {
  collectionId: string;
  collectionName: string;
  created: string;
  date: string;
  fit: string;
  id: string;
  name: string;
  user: string;
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
