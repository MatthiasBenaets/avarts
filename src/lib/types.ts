export interface Exercise {
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  id: string;
  name: string;
  description: string;
  sport: string;
  start_time: Date;
  tot_distance: number;
  avg_speed: number;
  max_speed: number;
  tot_elevation: number;
  avg_cadence: number;
  max_cadence: number;
  avg_hr: number;
  max_hr: number;
  avg_power: number;
  max_power: number;
  norm_power: number;
  tot_calories: number;
  elap_time: number;
  tot_time:number
  fit: string;
  gpx: string;
  img: string;
  location: string;
  expand: {
    user: User;
  };
  url: string;
  user: string;
  image: string;
};

export interface Exercises extends Array<Exercise> {
  length: number;
};

export interface Activities {
  items: Exercise[];
};

export interface Course {
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  id: string;
  sport: string;
  title: string;
  gpx: string;
  distance: number;
  elevation: number;
  time: number;
  img: number;
  expand: {
    user: User;
  };
  builder: Route;
  user: string;
};

export interface Courses extends Array<Course> {
  length: number;
};

export interface User {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
  weight: number;
};

export interface UserData {
  user: User;
};

export interface UserLocals {
  locals: {
    user: User;
  };
};

export interface Route {
  coordinates: Coordinates;
  actualWaypoints: {
    latLng: Coordinates;
  };
  summary: {
    totalDistance: number;
    totalAscend: number;
  };
};

export interface Routes {
  routes: Route[];
  length: number;
};

export interface Coordinates {
  lat: number;
  lng: number;
  meta: {
    elevation: number;
  };
};

export interface ElevationResponse {
  results: {
    latitude: number;
    longitude: number;
    elevation: number;
  };
};
