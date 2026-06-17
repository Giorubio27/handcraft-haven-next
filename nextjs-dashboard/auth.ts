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

        // Inside auth.ts -> authorize(credentials)

const { email, password } = parsedCredentials.data;
const user = await getUser(email);

if (!user) {
  console.log("❌ Authentication Rejected: Email not registered.");
  return null;
}

// 🪵 DIAGNOSTIC LOGS: Let's see exactly what your Next.js process is reading!
console.log("==================================================");
console.log("👉 PLAIN TEXT ENTERED:", password);
console.log("👉 STRING STORED IN DB ROW:", user.password);
console.log("👉 STRING LENGTH:", user.password?.length);
console.log("==================================================");

// 🧪 SANITY TEST: Verify if bcryptjs matches the hardcoded string manually
const hardwareTest = await bcrypt.compare('password123', '$2b$10$fVqX0X7kAnA79P02Q1W0beH1K8A0T8L/EaFOmgLgA3n5V3XfOnX6G');
console.log("🧪 INLINE SANITY TEST MATCHES:", hardwareTest); // This MUST be true

const passwordsMatch = await bcrypt.compare(password, user.password);
console.log("🔑 Actual database password match result:", passwordsMatch);
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
  