// app/dashboard/artisans/[id]/page.tsx
import { fetchArtisanById, fetchReviewsByProductId } from '@/app/lib/data';
import { fetchProductsByArtisanId } from '@/app/lib/data'; 
import ReviewForm from '@/app/ui/marketplace/review-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// 1. Define a strict TypeScript contract for your Product row structure
interface Product {
  id: string;
  artisan_id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
}

// Define the expanded structure that includes our sub-fetched reviews array
interface ProductWithReviews extends Product {
  reviews: any[];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const artisan = await fetchArtisanById(id);
  
  // 2. Cast the database fetch result as an array of our Product interface
  const products = (await fetchProductsByArtisanId(id)) as unknown as Product[];

  if (!artisan) {
    notFound();
  }

  // 3. Strongly type the mapped array signature
  const productsWithReviews: ProductWithReviews[] = await Promise.all(
    products.map(async (product) => {
      const reviews = await fetchReviewsByProductId(product.id);
      return { ...product, reviews };
    })
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      {/* Artisan Profile Header Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <span className="text-xs font-semibold bg-emerald-800 text-emerald-200 rounded px-2 py-1 uppercase tracking-wider">
          Authenticated Artisan
        </span>
        <h1 className="text-3xl font-bold mt-2">{artisan.name}</h1>
        <p className="text-emerald-100 mt-2 max-w-2xl text-sm leading-relaxed">{artisan.bio}</p>
        
        <div className="mt-6 flex gap-3">
          <Link
            href={`/dashboard/artisans/${id}/catalog/manage`}
            className="inline-block bg-white text-emerald-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50 transition"
          >
            + Add Item to Catalog
          </Link>
          <Link href="/dashboard/artisans" className="text-xs text-emerald-200 hover:underline flex items-center">
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      {/* Handcrafted Collection Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Curated Collection</h2>
        
        {productsWithReviews.length === 0 ? (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-6 border border-dashed border-gray-200 text-center">
            This artisan hasn't listed items in their shop catalog yet.
          </p>
        ) : (
          <div className="space-y-12">
            {productsWithReviews.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
                
                {/* Product Meta Column */}
                <div className="space-y-3">
                  <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover rounded-lg border border-gray-100" />
                  <div>
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{product.title}</h3>
                    <p className="text-xl font-extrabold text-emerald-900 mt-1">R$ {(product.price / 100).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Display Existing Reviews Stack */}
                <div className="space-y-3 border-t md:border-t-0 md:border-x border-gray-100 pt-4 md:pt-0 md:px-6 h-64 overflow-y-auto">
                  <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">Customer Reviews</h4>
                  
                  {product.reviews.length === 0 ? (
                    <p className="text-xs text-gray-400 italic pt-2">No feedback ratings left for this product yet.</p>
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

                {/* Interactive Feedback Form Column */}
                <div className="flex flex-col justify-center border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <ReviewForm productId={product.id} />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}