'use client';

import { ArtisansTable, User } from '@/app/lib/definitions';
import {
  UserCircleIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateArtisan } from '@/app/lib/actions';
import { useActionState } from 'react';
import { ArtisanState } from '@/app/lib/definitions';

export default function EditArtisanForm({
  artisan,
  users,
}: {
  artisan: ArtisansTable;
  users: User[];
}) {
  const initialState: ArtisanState = { message: null, errors: {} };
  
  // Invoice Pattern: Bind the specific artisan ID to the action
  const updateArtisanWithId = updateArtisan.bind(null, artisan.id);
  const [state, formAction] = useActionState(updateArtisanWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Linked User Account Selection */}
        <div className="mb-4">
          <label htmlFor="user" className="mb-2 block text-sm font-medium">
            Link to User Account
          </label>
          <div className="relative">
            <select
              id="user"
              name="user_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={artisan.user_id}
              aria-describedby="user-error"
            >
              <option value="" disabled>
                Select a user account
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="user-error" aria-live="polite" aria-atomic="true">
            {state.errors?.user_id?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Artisan Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Artisan Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={artisan.name}
              placeholder="Enter artisan name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Email Address */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Public Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={artisan.email}
              placeholder="artisan@example.com"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Profile Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Profile Image URL (Optional)
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="text"
              defaultValue={artisan.image_url || ''}
              placeholder="/artisans/custom-avatar.png"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Studio Bio Description */}
        <div className="mb-4">
          <label htmlFor="bio" className="mb-2 block text-sm font-medium">
            Studio Bio / Description
          </label>
          <div className="relative">
            <textarea
              id="bio"
              name="bio"
              defaultValue={artisan.bio}
              placeholder="Tell us about your craft, techniques, and studio..."
              rows={4}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-4 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="bio-error"
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500" />
          </div>
          <div id="bio-error" aria-live="polite" aria-atomic="true">
            {state.errors?.bio?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Global Action Failure Response Message */}
        {state.message && (
          <p className="mt-2 text-sm text-red-500" aria-live="polite">
            {state.message}
          </p>
        )}
      </div>

      {/* Control Actions Form Footing */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/artisans"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Artisan</Button>
      </div>
    </form>
  );
}