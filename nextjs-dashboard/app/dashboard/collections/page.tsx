import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import ArtisansTable from '@/app/ui/artisans/table';
import { CreateArtisan } from '@/app/ui/artisans/buttons';
import { playfairDisplay } from '@/app/ui/fonts';
import { ArtisansSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${playfairDisplay.className} text-2xl`}>Artisans</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Artisans..." />
        <CreateArtisan />
      </div>
       <Suspense key={query + currentPage} fallback={<ArtisansSkeleton />}>
        <ArtisansTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}