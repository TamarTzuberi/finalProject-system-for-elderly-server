export const enum UserRole {
    Admin = 'admin',
    Elderly = 'elderly',
    Volunteer = 'volunteer',
}

export interface User {
    username: string;
    password: string;
    role: UserRole;
};
