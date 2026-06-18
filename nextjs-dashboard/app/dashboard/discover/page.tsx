// app/dashboard/discover/page.tsx
import { fetchDiscoverCatalog } from '@/app/lib/data';
import DiscoverFeed from '@/app/ui/discover/discover-feed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Unique Handcrafts',
};

export default async function Page() {
  const items = await fetchDiscoverCatalog();

  // Extract unique categories dynamically so filter buttons update automatically if database entries grow
  const categories = ['All', ...new Set(items.map((item: any) => item.category))];

  return (
    <main className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Visual Hero Block */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-100 p-8 md:p-12 border border-orange-200/60 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Discover Extraordinary Crafts
        </h1>
        <p className="mt-2 text-gray-600 max-w-md text-sm md:text-base">
          Explore unique, hand-built treasures curated directly from independent studio artisans.
        </p>
      </div>

      {/* Feed Area containing interactive filters */}
      <DiscoverFeed initialItems={items} categories={categories} />
    </main>
  );
}