import { Gender } from './gender';

export interface Admin {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    email: string;
    city: string;
    gender: Gender;
    phoneNumber: string;
  }