import {Gender} from './gender'

export interface Volunteer {
    username: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    email: string;
    city: string;
    gender: Gender;
    areasOfInterest: string[];
    languages: string[];
    services: string[]; 
    digitalDevices: string[];
    phoneNumber: string;
    additionalInformation: string;
};