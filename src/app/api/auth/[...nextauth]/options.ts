// app/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/dbConnect";

//
// ✅ Type Declarations
//
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email?: string;
    role: string;
    serviceCategory: string;
    isVerified?: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email?: string;
    role: string;
    serviceCategory: string;
    isVerified?: boolean;
  }
}

//
// ✅ Auth Options
//
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const { email, password } = credentials;

        const result = await pool.query(
          `
          SELECT 
            u.user_id,
            u.email,
            u.password_hash,
            up.display_name,
            COALESCE(r.role_name, 'customer') AS role,
            u.is_email_verified
          FROM users u
          LEFT JOIN user_profiles up ON u.user_id = up.user_id
          LEFT JOIN roles r ON r.role_id = u.default_role_id
          WHERE u.email = $1 AND u.is_deleted = FALSE
          `,
          [email]
        );

        if (result.rows.length === 0) {
          throw new Error("Invalid email or user not found");
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.display_name || "",
          role: user.role,
          serviceCategory: "",
          isVerified: user.is_email_verified || false,
        };
      },
    }),
  ],


  callbacks: {
    
    async jwt({ token, user, trigger, session }) {
      
      if (user) {
        token.id = user.id;
        token.name = user.name || "";
        token.email = user.email || "";
        token.role = user.role;
        token.serviceCategory = user.serviceCategory;
        token.isVerified = user.isVerified;
      }

    
      if (trigger === "update" && session) {
        // Merge the updated data into the token
        return {
          ...token,
          ...session, // This contains the data you pass to update()
        };
      }

      return token;
    },

    // Populate session.user from JWT
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.serviceCategory = token.serviceCategory;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};