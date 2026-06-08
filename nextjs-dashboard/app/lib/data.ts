import postgres from 'postgres';
import {
  Artisan,
  ArtisanField,
  ArtisanRawSummary,
  ArtisanTotalSummary,
  Collection,
  Invoice,
  InvoicesTable,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ==========================================
// 1. DASHBOARD OVERVIEW QUERIES
// ==========================================



export async function fetchLatestInvoices() {
  try {
    // Fetches the 5 most recent invoices with the artisan's name, email, and image
    const data = await sql<any[]>`
      SELECT 
        invoices.id,
        invoices.amount,
        artisans.name, 
        artisans.image_url, 
        artisans.email
      FROM invoices
      JOIN artisans ON invoices.artisan_id = artisans.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // Run counting and summing calculations in parallel
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const artisanCountPromise = sql`SELECT COUNT(*) FROM artisans`;
    const invoiceStatusPromise = sql`SELECT
         COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS "paid",
         COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      artisanCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfArtisans = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(Number(data[2][0].paid ?? '0'));
    const totalPendingInvoices = formatCurrency(Number(data[2][0].pending ?? '0'));

    return {
      numberOfArtisans,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// ==========================================
// 2. INVOICES TAB QUERIES
// ==========================================

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        artisans.name,
        artisans.email,
        artisans.image_url
      FROM invoices
      JOIN artisans ON invoices.artisan_id = artisans.id
      WHERE
        artisans.name ILIKE ${`%${query}%`} OR
        artisans.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN artisans ON invoices.artisan_id = artisans.id
    WHERE
      artisans.name ILIKE ${`%${query}%`} OR
      artisans.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<Invoice[]>`
      SELECT
        invoices.id,
        invoices.artisan_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((inv) => ({
      ...inv,
      // Convert amount back to standard dollars/decimal format for input forms
      amount: inv.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

// ==========================================
// 3. ARTISANS TAB QUERIES
// ==========================================

export async function fetchArtisans() {
  try {
    const artisans = await sql<ArtisanField[]>`
      SELECT id, name FROM artisans ORDER BY name ASC
    `;
    return artisans;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all artisans.');
  }
}

export async function fetchFilteredArtisans(query: string): Promise<ArtisanTotalSummary[]> {
  try {
    const data = await sql<ArtisanRawSummary[]>`
    SELECT
      artisans.id,
      artisans.name,
      artisans.email,
      artisans.bio,
      artisans.image_url,
      COUNT(invoices.id) AS total_invoices,
      COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0) AS total_pending,
      COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END), 0) AS total_paid
    FROM artisans
    LEFT JOIN invoices ON artisans.id = invoices.artisan_id
    WHERE
      artisans.name ILIKE ${`%${query}%`} OR
      artisans.email ILIKE ${`%${query}%`}
    GROUP BY artisans.id, artisans.name, artisans.email, artisans.bio, artisans.image_url
    ORDER BY artisans.name ASC
    `;

    const formattedArtisans = data.map((artisan) => ({
      ...artisan,
      total_pending: formatCurrency(Number(artisan.total_pending)),
      total_paid: formatCurrency(Number(artisan.total_paid)),
    }));

    return formattedArtisans;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch artisan table summary.');
  }
}

// ==========================================
// 4. COLLECTIONS TAB QUERIES (Bonus implementation!)
// ==========================================

export async function fetchFilteredCollections(query: string) {
  try {
    const collections = await sql<any[]>`
      SELECT 
        collections.id,
        collections.name,
        collections.description,
        artisans.name AS artisan_name
      FROM collections
      JOIN artisans ON collections.artisan_id = artisans.id
      WHERE
        collections.name ILIKE ${`%${query}%`} OR
        collections.description ILIKE ${`%${query}%`} OR
        artisans.name ILIKE ${`%${query}%`}
      ORDER BY collections.name ASC
    `;
    return collections;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collections data.');
  }
}