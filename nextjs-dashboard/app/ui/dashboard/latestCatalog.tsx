import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { inter } from '@/app/ui/fonts';
import { fetchFeaturedCatalog } from '@/app/lib/data';

export async function LatestCatalog() {
    const latestGoods = await fetchFeaturedCatalog();


    return (
        <div className="flex w-full flex-col md:col-span-2">
              <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
                Latest Catalog Items
              </h2>
              <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {/* NOTE: Uncomment this code in Chapter 7 */}
        
                <div className="bg-white px-6">
                  {latestGoods.map((good, i) => {
                    return (
                      <div
                        key={good.id}
                        className={clsx(
                          'flex flex-row items-center justify-between py-4',
                          {
                            'border-t': i !== 0,
                          },
                        )}
                      >
                        <div className="flex items-center">
                          <Image
                            src={good.image_url}
                            alt={`${good.title}'s profile picture`}
                            className="mr-4 rounded-full"
                            width={32}
                            height={32}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold md:text-base">
                              {good.title}
                            </p>
                           
                          </div>
                        </div>
                        <p
                          className={`${inter.className} truncate text-sm font-medium md:text-base`}
                        >
                          {good.price}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center pb-2 pt-6">
                  <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div>
              </div>
            </div>
    )
}