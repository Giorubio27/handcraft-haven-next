import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// auth.ts
// ... (keep your existing imports)

async function getUser(email: string) {
  try {
    console.log("🔍 Attempting DB lookup for email:", email);
    const user = await sql`
      SELECT id, name, email, password, role 
      FROM users 
      WHERE email = ${email}
    `;
    console.log("💾 DB Lookup Result:", user[0] ? "User Found ✅" : "User NOT Found ❌");
    return user[0];
  } catch (error) {
    console.error('❌ Database connection error inside getUser():', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("📥 Raw Credentials Received:", credentials);

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("❌ Zod Validation Failed:", parsedCredentials.error.flatten());
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        
        if (!user) {
          console.log("❌ Authentication Rejected: Email not registered.");
          return null;
        }

        console.log("🔒 Verifying password hash...");
        const passwordsMatch = await bcrypt.compare(password, user.password);
        console.log("🔑 Password verification match result:", passwordsMatch);

        if (passwordsMatch) {
          console.log("🎉 SUCCESS! User authenticated cleanly.");
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        console.log("❌ Authentication Rejected: Password mismatch.");
        return null;
      },
    }),
  ],
});
  