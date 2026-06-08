// app/seed/route.ts
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, artisans, collections, invoices } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  return await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );
}

async function seedArtisans() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS artisans (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      bio TEXT,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  return await Promise.all(
    artisans.map(
      (artisan) => sql`
        INSERT INTO artisans (id, name, email, bio, image_url)
        VALUES (${artisan.id}, ${artisan.name}, ${artisan.email}, ${artisan.bio}, ${artisan.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

async function seedCollections() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS collections (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT
    );
  `;

  return await Promise.all(
    collections.map(
      (col) => sql`
        INSERT INTO collections (id, artisan_id, name, description)
        VALUES (${col.id}, ${col.artisan_id}, ${col.name}, ${col.description})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  return await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (artisan_id, amount, status, date)
        VALUES (${invoice.artisan_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

export async function GET() {
  try {
    // Seeding in sequential order to preserve Foreign Key constraints
    await seedUsers();
    await seedArtisans();     // Dependent tables must come after this
    await seedCollections();  // Requires artisan_id
    await seedInvoices();     // Requires artisan_id

    return Response.json({ message: 'Handcraft Haven database seeded successfully' });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}