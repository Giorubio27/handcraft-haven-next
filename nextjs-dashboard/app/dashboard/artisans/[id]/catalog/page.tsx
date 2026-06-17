// app/dashboard/artisans/[id]/catalog/page.tsx
import { fetchArtisanById, fetchProductsByArtisanId } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  artisan_id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // 1. Fetch data for this specific artisan's catalog scope
  const artisan = await fetchArtisanById(id);
  const products = (await fetchProductsByArtisanId(id)) as unknown as Product[];

  if (!artisan) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header breadcrumb tracking navigation path */}
      <div className="text-sm text-gray-500">
        <Link href="/dashboard/artisans" className="hover:underline text-emerald-700">Artisans</Link>
        {' / '}
        <Link href={`/dashboard/artisans/${id}`} className="hover:underline text-emerald-700">{artisan.name}</Link>
        {' / '}
        <span className="text-gray-900 font-medium">Catalog</span>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{artisan.name}'s Full Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">
          Showing all {products.length} handcrafted items currently available for purchase.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
          No items have been posted to this catalog yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-800 rounded px-2 py-0.5">
                    {product.category}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">{product.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                </div>
              </div>
              <div className="p-4 pt-0 mt-4 flex items-center justify-between border-t border-gray-50">
                <span className="text-base font-bold text-emerald-900">
                  R$ {(product.price / 100).toFixed(2)}
                </span>
                <Link
                  href={`/dashboard/artisans/${id}`}
                  className="text-xs font-medium text-emerald-700 hover:underline"
                >
                  View Reviews & Form →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}