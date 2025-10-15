// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    user_id?:string;
    id: string;
    name: string;
    display_name?:string;
    role: string;
    email?:string
    avatar?:string;
    is_onboarded?:boolean;
    serviceCategory: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      display_name?:string;
      username: string;
      role: string;
      serviceCategory: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    display_name?:string;
    role: string;
    serviceCategory: string;
  }
}