export class WaltIdRegisterDto {
    name: string;
    email: string;
    password: string;
    type: 'email' | 'address';
}
  
export class WaltIdLoginDto {
    email: string;
    password: string;
    type: 'email' | 'address';
}
  
export class WaltIdAuthResponse {
    token: string;
    id: string;
    username: string;
}