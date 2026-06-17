// app/dashboard/artisans/[id]/page.tsx
import { notFound } from 'next/navigation';
import { fetchArtisanById, fetchProductsByArtisanId } from '@/app/lib/data';
import SellerProfileCard from '@/app/ui/dashboard/seller-profile';
import Breadcrumbs from '@/app/ui/artisans/breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  // Fetch both datasets concurrently
  const [artisan, products] = await Promise.all([
    fetchArtisanById(id),
    fetchProductsByArtisanId(id)
  ]);

  if (!artisan) {
    notFound();
  }

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
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

      {/* Main Seller Story and Card */}
      <SellerProfileCard artisan={artisan} />

      {/* Connected Product Collections Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Handcrafted Catalog & Collections
            </h2>
            <p className="text-sm text-gray-500">
              Browse through unique creations made by {artisan.name}.
            </p>
          </div>
          
          <Link 
            href={`/dashboard/artisans/${id}/catalog/manage`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-800 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Manage Catalog & Pricing
          </Link>
        </div>

        {/* Product Grid Layout */}
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-sm text-gray-500">
            No products listed in this collection yet. Click "Manage Catalog" to add your first item!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Product Image Spot */}
                <div className="relative aspect-video w-full bg-gray-100">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.title} 
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No Preview Image
                    </div>
                  )}
                  <span className="absolute top-2 right-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    {product.category}
                  </span>
                </div>

                {/* Info Text Elements */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <span className="font-bold text-emerald-800 shrink-0">
                      R$ {(product.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}