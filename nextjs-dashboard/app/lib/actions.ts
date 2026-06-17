'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { ArtisanState } from './definitions';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.'
  }),
  amount: z.coerce
    .number()
    .gt(0,{ message: 'Please enter an amount greater than $0.'}),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string(),
});

const CatalogSchema = z.object({
  artisanId: z.string().uuid(),
  title: z.string().min(1, 'Please enter a product title.'),
  price: z.coerce.number().gt(0, 'Please enter a price greater than 0.'),
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().min(5, 'Please provide a short description.'),
  image_url: z.string().optional(),
});

// app/lib/actions.ts
export type CatalogState = {
  errors?: {
    title?: string[];
    price?: string[];
    category?: string[];
    description?: string[];
    image_url?: string[];
  };
  message?: string;
};
// Update the parameters to accept artisanId first
export async function createCatalogItem(
  artisanId: string,
  prevState: CatalogState,
  formData: FormData
): Promise<CatalogState> { // Explicitly typing the return solves overload mismatches
  const validatedFields = CatalogSchema.safeParse({
    artisanId: artisanId,
    title: formData.get('title'),
    price: formData.get('price'),
    category: formData.get('category'),
    description: formData.get('description'),
    image_url: formData.get('image_url') || undefined,
  });

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid Form Fields. Failed to add product.');
  }

  const { title, price, category, description, image_url } = validatedFields.data;
  const priceInCents = Math.round(price * 100);
  const fallbackImage = image_url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

  try {
    await sql`
      INSERT INTO products (artisan_id, title, price, description, category, image_url)
      VALUES (${artisanId}, ${title}, ${priceInCents}, ${description}, ${category}, ${fallbackImage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to add item to catalog.' };
  }

  revalidatePath(`/dashboard/artisans/${artisanId}`);
  redirect(`/dashboard/artisans/${artisanId}`);
}

const ReviewSchema = z.object({
  productId: z.string().uuid(),
  userName: z.string().min(1, 'Please enter your name.'),
  rating: z.coerce.number().min(1).max(5, 'Please select a rating between 1 and 5.'),
  comment: z.string().min(3, 'Please provide a descriptive comment.'),
});

export type ReviewState = {
  errors?: { userName?: string[]; rating?: string[]; comment?: string[] };
  message?: string;
};

export async function createProductReview(productId: string, prevState: ReviewState, formData: FormData): Promise<ReviewState> {
  const validatedFields = ReviewSchema.safeParse({
    productId: productId,
    userName: formData.get('userName'),
    rating: formData.get('rating'),
    comment: formData.get('comment'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Could not submit review.',
    };
  }

  const { userName, rating, comment } = validatedFields.data;

  try {
    await sql`
      INSERT INTO reviews (product_id, user_name, rating, comment)
      VALUES (${productId}, ${userName}, ${rating}, ${comment})
    `;
  } catch (error) {
    console.error('Database error adding review:', error);
    return { message: 'Database failure: failed to submit review details.' };
  }

  // Hard revalidate back to the artisan view layout to sync changes
  revalidatePath(`/dashboard/artisans`);
  return { message: 'Review added successfully!' }; 
}
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
 
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// app/lib/actions.ts
// ... (keep your existing imports, but ensure you have: import { ArtisanState } from './definitions';)

/**
 * ZOD SCHEMA: Defines validation rules for all artisan forms.
 */
const ArtisanSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  image_url: z.string().url({ message: 'Invalid image URL.' }).optional(),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
  user_id: z.string().uuid({ message: 'Please provide a valid user account link.' }),
});

// Separate schemata for different actions, mirroring the Invoice pattern.
const CreateArtisanZod = ArtisanSchema.omit({ id: true });
const UpdateArtisanZod = ArtisanSchema.omit({ id: true });


/**
 * ACTION: createArtisan (Same Style as createInvoice)
 */
export async function createArtisan(prevState: ArtisanState, formData: FormData) {
  // Validate form data using Zod
  const validatedFields = CreateArtisanZod.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url') || undefined,
    bio: formData.get('bio'),
    user_id: formData.get('user_id'), 
  });
 
  // If form validation fails, return errors early.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Artisan Profile.',
    };
  }
 
  const { name, email, image_url, bio, user_id } = validatedFields.data;
  const fallbackImage = image_url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

  // Insert data into the database
  try {
    await sql`
      INSERT INTO artisans (name, email, image_url, bio, user_id)
      VALUES (${name}, ${email}, ${fallbackImage}, ${bio}, ${user_id})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Artisan Profile.',
    };
  }
 
  // Clear cache and redirect (Invoice Style)
  revalidatePath('/dashboard/artisans');
  redirect('/dashboard/artisans');
}

/**
 * ACTION: updateArtisan (Same Style as updateInvoice)
 */
export async function updateArtisan(
  id: string,
  prevState: ArtisanState,
  formData: FormData,
) {
  const validatedFields = UpdateArtisanZod.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url') || undefined,
    bio: formData.get('bio'),
    user_id: formData.get('user_id'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Artisan.',
    };
  }
 
  const { name, email, image_url, bio, user_id } = validatedFields.data;

  const postgresImageUrl = image_url ? image_url : null;
 
  try {
    await sql`
      UPDATE artisans
      SET name = ${name}, email = ${email}, image_url = ${postgresImageUrl}, bio = ${bio}, user_id = ${user_id}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Artisan Profile.' };
  }
 
  revalidatePath('/dashboard/artisans');
  redirect('/dashboard/artisans');
}

/**
 * ACTION: deleteArtisan (Same Style as deleteInvoice)
 */
export async function deleteArtisan(id: string) {
  try {
    // 1. Run the database deletion
    await sql`DELETE FROM artisans WHERE id = ${id}`;
    
    // 2. Clear the cache to refresh the layout page immediately
    revalidatePath('/dashboard/artisans');
    
  } catch (error) {
    // Invoice pattern style: log the error on the server and do not return an object.
    console.error('Database Error:', error);
  }
  
  // By leaving this function with NO return statements, JavaScript implicitly 
  // returns undefined, matching the exact Promise<void> signature required by form actions.
}