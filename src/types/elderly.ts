import { Gender } from './gender';

export interface Elderly {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    email: string;
    city: string;
    gender: Gender;
    phoneNumber: string;
    areasOfInterest: string[];
    languages: string[];
    wantedServices: string[];
    digitalDevices: string[];
    additionalInformation: string;
    contactName: string;
    contactPhoneNumber: string;
};
