import { fetchDiscoverCatalog } from '@/app/lib/data';
import DiscoverFeed from '@/app/ui/discover/discover-feed';
import { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Discover Unique Handcrafts',
};

export default async function Page() {
  const items = await fetchDiscoverCatalog();

  const categories = ['All', ...new Set(items.map((item: any) => item.category))];

  return (
    <main className='space-y-8 p-4 md:p-6 max-w-7xl mx-auto' >
      <div className='rounded-2xl bg-gradient-to-r from-bg-teal-900 to-bg-amber-400'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Discover our passion
        </h1>
        <p className='mt-2 text-gray-500'>Explore our Haven</p>
      </div>
      <DiscoverFeed initialItems={items} categories={categories} />
    </main>
  )
}

