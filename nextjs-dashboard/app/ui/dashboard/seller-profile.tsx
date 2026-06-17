import Image from 'next/image';
import { playfairDisplay } from '@/app/ui/fonts';
import { EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ArtisansTable } from '@/app/lib/definitions';


export default function SellerProfileCard({ artisan }: { artisan: ArtisansTable }) {
  return (
    <div className="rounded-xl bg-gray-50 p-6 shadow-sm md:p-8">
      {/* Responsive Layout Layout: Stacks on mobile, splits side-by-side on desktop */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative h-24 w-24 flex-shrink-0 self-center md:self-start">
          <Image
            src={artisan.image_url || '/artisans/default.png'}
            alt={`${artisan.name}'s profile avatar`}
            className="rounded-full object-cover border-2 border-emerald-800"
            fill
            sizes="(max-width: 768px) 96px, 96px"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h2 className={`${playfairDisplay.className} text-2xl font-bold text-gray-900 text-center md:text-left`}>
              {artisan.name}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 md:justify-start">
              <EnvelopeIcon className="h-4 w-4 text-emerald-700" />
              <span>{artisan.email}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Our Story & Craftsmanship
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {artisan.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}