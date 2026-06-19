import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  ArtisansTable,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  featuredArtisans, 
  User
} from './definitions';
import { formatCurrency } from './utils';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchUsers() {
  try {
    const data = await sql<User[]>`
    SELECT id, name, email
    FROM users
    ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('database ERROR:', error)
    throw new Error('Failed to fetch all user accounts')
  }
}

export async function fetchDiscoverCatalog() {
  try {

    const data = await sql`
    SELECT 
    p.id,
    p.title,
    p.category,
    p.description,
    p.price,
    p.image_url AS product_image
    a.id AS artisan_id,
    a.name AS artisan_name,
    a.image_url AS artisan_image
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    ORDER BY RANDOM()`;

    return data;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to load the category');
  }
}

export async function fetchReviewsByProductId(productId: string) {
  try {
    // Make sure column names match your database schema exactly
    const reviews = await sql`
      SELECT id, product_id, user_name, rating, comment, created_at 
      FROM reviews 
      WHERE product_id = ${productId}
      ORDER BY created_at DESC
    `;
    return reviews;
  } catch (error) {
    console.error('Database Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews.');
  }
}

export async function fetchFilteredProducts(query: string, category: string, maxPrice: number) {
  // Convert price limit to cents for database compliance (default to a high number if blank)
  const maxPriceInCents = maxPrice ? Math.round(maxPrice * 100) : 99999999; 
  const searchString = `%${query}%`;

  try {
    const products = await sql`
      SELECT products.*, artisans.name as artisan_name 
      FROM products
      JOIN artisans ON products.artisan_id = artisans.id
      WHERE 
        (products.title ILIKE ${searchString} OR products.description ILIKE ${searchString})
        AND (${category} = '' OR products.category = ${category})
        AND products.price <= ${maxPriceInCents}
      ORDER BY products.title ASC
    `;
    return products;
  } catch (error) {
    console.error('Database Error fetching filtered products:', error);
    throw new Error('Failed to fetch marketplace catalog.');
  }
}

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
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
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
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
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
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
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
    console.log(invoice); // Invoice is an empty array []
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchFilteredArtisans(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const artisans = await sql<ArtisansTable[]>`
      SELECT
        artisans.id,
        artisans.name,
        artisans.email,
        artisans.image_url
      FROM artisans
      WHERE
        artisans.name ILIKE ${`%${query}%`} OR
        artisans.email ILIKE ${`%${query}%`}
      ORDER BY artisans.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return artisans;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisans.');
  }
}

export async function fetchFeaturedArtisans() {
  try {
    const data = await sql<featuredArtisans[]>`
      SELECT  artisans.name, artisans.image_url, artisans.email, artisans.id
      FROM artisans
      ORDER BY artisans.name DESC
      LIMIT 5`;

    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
};

export async function fetchArtisanById(id: string) {
  try {
    const data = await sql<ArtisansTable[]>`
      SELECT id, name, email, image_url, bio
      FROM artisans
      WHERE id = ${id}
    `;

    return data[0]; // Return the single matching record object
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisan profile data.');
  }
}
// app/lib/data.ts
export async function fetchProductsByArtisanId(artisanId: string) {
  try {
    const data = await sql`
      SELECT id, title, price, description, category, image_url 
      FROM products 
      WHERE artisan_id = ${artisanId}
      ORDER BY created_at DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artisan collection.');
  }
}

