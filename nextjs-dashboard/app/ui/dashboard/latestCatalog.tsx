import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { inter } from '@/app/ui/fonts';
import { fetchFeaturedCatalog } from '@/app/lib/data';
import Link from 'next/link';
import { formatCurrency } from '@/app/lib/utils';

export async function LatestCatalog() {
  const latestGoods = await fetchFeaturedCatalog();


  return (
    (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {latestGoods.map((item) => (
          <div key={item.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            
            {/* Product image window */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Image
                src={item.image_url || '/products/placeholder.png'}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Information block */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">{item.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">{formatCurrency(item.price)}</span>

                
                
              </div>
            </div>

          </div>
        ))}
      </div>
    )
      
  )
}