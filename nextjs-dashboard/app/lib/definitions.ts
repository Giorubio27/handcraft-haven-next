// app/lib/definitions.ts

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional so you don't accidentally pass hashed passwords around the UI
};

export type Artisan = {
  id: string;
  name: string;
  email: string;
  bio: string;
  image_url: string;
};

export type Collection = {
  id: string;
  artisan_id: string;
  name: string;
  description: string;
};

export type Invoice = {
  id?: string; // Optional if generated automatically by your DB on insertion
  artisan_id: string;
  amount: number;
  status: 'paid' | 'pending';
  date: string;
};

// Used for simple selection lists (like choosing an artisan when creating an invoice)
export type ArtisanField = {
  id: string;
  name: string;
};

// Used when displaying combined data in a table view
export type InvoicesTable = {
  id: string;
  artisan_id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  name: string;
  email: string;
  image_url: string;
};

// What the PostgreSQL query returns before number conversion/formatting
export type ArtisanRawSummary = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  bio: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

// What your Artisan component loops through after running formatCurrency()
export type ArtisanTotalSummary = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  bio: string;
  total_invoices: number;
  total_pending: string; // Formatted string: "$240.00"
  total_paid: string;    // Formatted string: "$125.00"
};

// For the Revenue Chart
export type Revenue = {
  month: string;
  revenue: number;
};