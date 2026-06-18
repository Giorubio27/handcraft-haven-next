'use client';

import { useState } from "react";
import Link from 'next/link';
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/app/lib/utils";

export default function DiscoverFeed({ initialItems, categories }: { initialItems: any[]; categories: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSort, setActiveSort] = useState('random');

    const filteredItems = initialItems.filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.artisan_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Filtering controls */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border-b border-gray-100 pb-6">
                
                {/* Category selection buttons */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {categories.map((category) => (
                        <button 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                                selectedCategory === category
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* The search bar component */}
                <div className="relative min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Search for artist or items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-gray-900 outline-none"
                    />
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Grid display */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-16 border rounded-xl border-dashed bg-gray-50">
                    <p className="text-gray-500 text-sm">No items match your description.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            
                            {/* Product image window */}
                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                <Image
                                    src={item.product_image || '/products/placeholder.png'}
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

                                    {/* Artisan profile link */}
                                    <Link href={`/dashboard/artisans/${item.artisan_id}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                                        <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-200">
                                            <Image 
                                                src={item.artisan_image || '/artisan/default-avatar.png'} 
                                                alt={item.artisan_name} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 line-clamp-1 max-w-[90px]">{item.artisan_name}</span>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}