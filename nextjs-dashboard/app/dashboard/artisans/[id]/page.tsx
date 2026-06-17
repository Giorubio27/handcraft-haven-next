// app/dashboard/artisans/[id]/page.tsx
import { notFound } from 'next/navigation';
import { fetchArtisanById, fetchProductsByArtisanId, fetchReviewsByProductId } from '@/app/lib/data';
import SellerProfileCard from '@/app/ui/dashboard/seller-profile';
import Breadcrumbs from '@/app/ui/artisans/breadcrumbs';
import ReviewForm from '@/app/ui/marketplace/review-form';
import Link from 'next/link';
import Image from 'next/image';

// 1. Structural contracts to make TypeScript happy with database fields
interface Product {
  id: string;
  artisan_id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
}

interface ProductWithReviews extends Product {
  reviews: any[];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  // Fetch both base datasets concurrently
  const [artisan, rawProducts] = await Promise.all([
    fetchArtisanById(id),
    fetchProductsByArtisanId(id)
  ]);

  if (!artisan) {
    notFound();
  }

  // Cast the raw product list safely through unknown
  const products = rawProducts as unknown as Product[];

  // 2. Map over products to fetch their respective reviews from PostgreSQL
  const productsWithReviews: ProductWithReviews[] = await Promise.all(
    products.map(async (product) => {
      const reviews = await fetchReviewsByProductId(product.id);
      return { ...product, reviews };
    })
  );

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
        {productsWithReviews.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-sm text-gray-500">
            No products listed in this collection yet. Click "Manage Catalog" to add your first item!
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {productsWithReviews.map((product) => (
              <div 
                key={product.id} 
                className="group grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* Column 1: Product Info & Image */}
                <div className="space-y-3">
                  <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.title} 
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
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

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {product.title}
                    </h3>
                    <span className="font-bold text-emerald-800 shrink-0">
                      R$ {(product.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Column 2: Live Feedback Review Feed */}
                <div className="space-y-3 border-t md:border-t-0 md:border-x border-gray-100 pt-4 md:pt-0 md:px-6 h-64 overflow-y-auto">
                  <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">
                    Customer Reviews
                  </h4>
                  
                  {product.reviews.length === 0 ? (
                    <p className="text-xs text-gray-400 italic pt-2">
                      No feedback ratings left for this product yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {product.reviews.map((review: any) => (
                        <div key={review.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800">{review.user_name}</span>
                            <span className="text-amber-500">{'⭐'.repeat(review.rating)}</span>
                          </div>
                          <p className="text-gray-600 italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 3: Interactive Submission Form */}
                <div className="flex flex-col justify-center border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <ReviewForm productId={product.id} />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}