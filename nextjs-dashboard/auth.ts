import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string) {
  try {
    // Execute the query using the postgres tag template
    const user = await sql`
      SELECT id, name, email, password, role 
      FROM users 
      WHERE email = ${email}
    `;
    
    // 🌟 THE FIX: 'user' is already the array of rows! Access index [0] directly.
    return user[0]; 
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // 🌟 CRITICAL FIX: Return the role and id explicitly so the JWT callback sees them!
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role, // <-- MUST BE HERE
            };
          }
        }

        return null;
      },
    }),
  ],
});