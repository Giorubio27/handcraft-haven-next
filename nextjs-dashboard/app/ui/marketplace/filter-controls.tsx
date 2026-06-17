// app/ui/marketplace/filter-controls.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function FilterControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
      {/* Text Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Search Products</label>
        <input
          type="text"
          placeholder="e.g., vase, leather..."
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="w-full text-sm rounded-lg border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
        <select
          defaultValue={searchParams.get('category')?.toString() || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full text-sm rounded-lg border border-gray-300 p-2 bg-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Ceramics">Ceramics</option>
          <option value="Leather">Leather</option>
          <option value="Textiles">Textiles</option>
          <option value="Woodworking">Woodworking</option>
          <option value="Jewelry">Jewelry</option>
        </select>
      </div>

      {/* Max Price Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Price (BRL)</label>
        <input
          type="number"
          placeholder="Max R$"
          defaultValue={searchParams.get('maxPrice')?.toString()}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          className="w-full text-sm rounded-lg border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </div>
  );
}