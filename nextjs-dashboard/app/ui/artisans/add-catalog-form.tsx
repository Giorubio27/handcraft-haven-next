/// app/ui/artisans/add-catalog-form.tsx
'use client';

import { useActionState } from 'react';
import { createCatalogItem, CatalogState } from '@/app/lib/actions';
import Link from 'next/link';

export default function AddCatalogItemForm({ artisanId }: { artisanId: string }) {
  const initialState: CatalogState = { errors: {} };

  // By passing 'null' and 'artisanId', JS skips prevState and binds to the second position!
  const createCatalogItemWithId = createCatalogItem.bind(null, artisanId);
  
  // TypeScript will now see a perfect type match
  const [state, formAction] = useActionState(createCatalogItemWithId, initialState);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Catalog Item</h1>
      <p className="text-sm text-gray-500 mb-6">
        List a new handcrafted creation and update pricing parameters.
      </p>

      <form action={formAction} className="space-y-5">
        {/* Product Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Product Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Hand-Thrown Terracotta Vase"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
            aria-describedby="title-error"
          />
          {state.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error} id="title-error">
                {error}
              </p>
            ))}
        </div>

        {/* Pricing Row */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="block w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
              aria-describedby="price-error"
            />
          </div>
          {state.errors?.price &&
            state.errors.price.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error} id="price-error">
                {error}
              </p>
            ))}
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Marketplace Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
            aria-describedby="category-error"
          >
            <option value="">Select a category...</option>
            <option value="Ceramics">Ceramics</option>
            <option value="Leather">Leather</option>
            <option value="Textiles">Textiles</option>
            <option value="Woodworking">Woodworking</option>
            <option value="Jewelry">Jewelry</option>
          </select>
          {state.errors?.category &&
            state.errors.category.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error} id="category-error">
                {error}
              </p>
            ))}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Item Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Tell buyers about the specific materials used..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
            aria-describedby="description-error"
          />
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error} id="description-error">
                {error}
              </p>
            ))}
        </div>

        {/* Top-Level Error message fallback */}
        {state.message && (
          <p className="mt-2 text-sm text-red-500 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
            {state.message}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href={`/dashboard/artisans/${artisanId}`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            Add Item to Collection
          </button>
        </div>
      </form>
    </div>
  );
}