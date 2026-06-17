import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { inter } from '@/app/ui/fonts';
import { fetchFeaturedArtisans } from '@/app/lib/data';
import Link from 'next/link';

export default async function NewArtisans() { // Remove props
  const featuredArtisansToday = await fetchFeaturedArtisans();
 
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
        Featured Artisans
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white px-6">
          {featuredArtisansToday.map((artisan, i) => {
            return (
              <Link 
                key={artisan.id} 
                href={`/dashboard/artisans/${artisan.id}`}
                className="flex flex-row items-center justify-between py-4 hover:bg-gray-50 transition-colors rounded-lg px-2"
                >
                <div className="flex items-center">
                  <Image
                    src={artisan.image_url}
                    alt={`${artisan.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {artisan.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {artisan.email}
                    </p>
                  </div>
                    </div>
                </Link>

            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
