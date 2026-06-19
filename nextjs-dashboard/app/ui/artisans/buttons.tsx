

// app/ui/artisans/buttons.tsx
import { PencilIcon, PlusIcon, TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteArtisan } from '@/app/lib/actions'; // Import the newly created action

// INVOICE STYLE: Main Create CTA
export function CreateArtisan() {
  return (
    <Link
      href="/dashboard/artisans/create"
      className="flex h-10 items-center rounded-lg bg-emerald-800 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <span className="hidden md:block">Create Artisan</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function DiscoverArtisan({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/artisans/${id}/`} // Points to the dynamic [id]/edit/page.tsx route
      className="rounded-md border p-2 hover:bg-gray-100"
      aria-placeholder='Discover'
    >
      <GlobeAltIcon className="w-5" />
    </Link>
  );
}

// INVOICE STYLE: Updates the dynamic route path
export function UpdateArtisan({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/artisans/${id}/edit`} // Points to the dynamic [id]/edit/page.tsx route
      className="rounded-md border p-2 hover:bg-gray-100"
      aria-placeholder='Update'
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// INVOICE STYLE: Direct Action Form Submission
export function DeleteArtisan({ id }: { id: string }) {
  // Bind the specific ID directly to the action execution loop
  const deleteArtisanWithId = deleteArtisan.bind(null, id);

  return (
    // We must wrap the delete button in a form to submit the action directly
    <form action={deleteArtisanWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-red-100 hover:text-red-600" aria-placeholder='Delete'>
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}