import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
  // Updated to JOIN with 'artisans' on 'artisan_id' and select a valid seed amount
  const data = await sql`
    SELECT invoices.amount, artisans.name, artisans.email
    FROM invoices
    JOIN artisans ON invoices.artisan_id = artisans.id
    WHERE invoices.amount = 12500;
  `;

  return data;
}

export async function GET() {
  try {
    const data = await listInvoices();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : error }, 
      { status: 500 }
    );
  }
}
