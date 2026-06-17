import { notFound } from 'next/navigation';
import postgres from 'postgres';
import { ArtisansTable } from '@/app/lib/definitions';
import SellerProfileCard from '@/app/ui/dashboard/seller-profile';
import Breadcrumbs from '@/app/ui/artisans/breadcrumbs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function fetchArtisanById(id: string) {
    try {
        const data = await sql<ArtisansTable[]>
            `SELECT artisans.id, artisans.name, artisans.email, 
        artisans.image_url, artisans.bio
        FROM artisans
        WHERE id = ${id}`;
        return data[0]
    } catch (error) {
        console.error('Database Error:', error)
        return null;
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const artisan = await fetchArtisanById(id);

    if (!artisan) {
        notFound();
    }
    return (
        <main className="w-full max-w-4xl mx-auto px-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Artisans', href: '/dashboard/artisans' },
          { label: `${artisan.name}`, href: `/dashboard/profile/${id}`, active: true },
        ]}
      />
      <SellerProfileCard artisan={artisan} />
    </main>


    );
    
}