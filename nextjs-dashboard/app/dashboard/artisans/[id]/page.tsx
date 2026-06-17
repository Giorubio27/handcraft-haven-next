import { notFound } from 'next/navigation';
import { fetchArtisanById } from '@/app/lib/data'; // Adjust this import path to your data fetcher
import SellerProfileCard from '@/app/ui/dashboard/seller-profile'; // Adjust this import path to your component
import Breadcrumbs from '@/app/ui/artisans/breadcrumbs'; // Reusing your breadcrumbs component

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  // Fetch the specific artisan data using the ID from the URL
  const artisan = await fetchArtisanById(id);

  // If the ID structure is valid but no matching record is found in the database, trigger Next.js 404
  if (!artisan) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Artisans', href: '/dashboard/artisans' },
          {
            label: `${artisan.name} Profile`,
            href: `/dashboard/artisans/${id}`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <SellerProfileCard artisan={artisan} />
      </div>
    </main>
  );
}