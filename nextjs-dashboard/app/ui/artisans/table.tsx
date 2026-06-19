import Image from 'next/image';
import { fetchFilteredArtisans } from '@/app/lib/data';
import { CreateArtisan, UpdateArtisan, DeleteArtisan } from './buttons';
import Link from 'next/link';

export default async function ArtisansTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const artisans = await fetchFilteredArtisans(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {artisans?.map((artisan) => (
              <Link key={artisan.id} href={`/dashboard/artisans/${artisan.id}`} className='flex flex-row items-center justify-between py-4 hover:bg-gray-50 transition-colors rounded-lg px-2'
                
                
              >
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={artisan.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${artisan.name}'s profile picture`}
                      />
                      <p>{artisan.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{artisan.email}</p>
                  </div>
                  
                </div>
                  <div className="flex justify-end gap-2">
                    <UpdateArtisan id={artisan.id} />
                    <DeleteArtisan id={artisan.id} />
                  </div>
                </Link>
              
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Artisan
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {artisans?.map((artisan) => (
                <tr
                  key={artisan.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={artisan.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${artisan.name}'s profile picture`}
                      />
                      <p>{artisan.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {artisan.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateArtisan id={artisan.id} />
                      <DeleteArtisan id={artisan.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
