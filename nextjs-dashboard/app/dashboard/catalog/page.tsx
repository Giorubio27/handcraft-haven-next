// app/dashboard/artisans/page.tsx
import { fetchFilteredProducts } from '@/app/lib/data';
import FilterControls from '@/app/ui/marketplace/filter-controls';
import Link from 'next/link';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    maxPrice?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const category = searchParams?.category || '';
  const maxPrice = Number(searchParams?.maxPrice) || 0;

  const products = await fetchFilteredProducts(query, category, maxPrice);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Handcrafted Marketplace</h1>
      <p className="text-sm text-gray-500 mb-6">
        Browse through unique creations made by authenticated regional artisans.
      </p>

      <FilterControls />

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
          No handcrafted products match your current filtering criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-[1.02] transition duration-200"
                />
                <div className="p-4">
                  <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-800 rounded px-2 py-0.5 mb-2">
                    {product.category}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">{product.title}</h2>
                  <p className="text-xs text-gray-400 mb-2">By: {product.artisan_name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              </div>

              {/* Updated Action Footer Block */}
              <div className="p-4 pt-0 border-t border-gray-100 flex flex-col gap-2 mt-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-base font-bold text-emerald-900">
                    R$ {(product.price / 100).toFixed(2)}
                  </span>
                </div>
                
                {/* 1. Primary Button: Link straight to the standalone catalog view */}
                <Link
                  href={`/dashboard/artisans/${product.artisan_id}/catalog`}
                  className="text-center w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                >
                  Browse Full Shop Catalog
                </Link>

                {/* 2. Secondary Link: Go to the profile page to see or write reviews */}
                <Link
                  href={`/dashboard/artisans/${product.artisan_id}`}
                  className="text-center text-xs font-medium text-emerald-700 hover:underline py-1"
                >
                  View Artisan Reviews & Feedback →
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}