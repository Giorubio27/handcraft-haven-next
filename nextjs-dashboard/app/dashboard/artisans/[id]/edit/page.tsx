import Form from '@/app/ui/artisans/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchArtisanById, fetchUsers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Artisans',
};
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // Invoice Style: Fetch data in parallel to prevent request waterfalls
  const [artisan, users] = await Promise.all([
    fetchArtisanById(id),
    fetchUsers(),
  ]);

  // Invoice Style: Trigger 404 UI if the artisan ID doesn't exist
  if (!artisan) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Artisans', href: '/dashboard/artisans' },
          {
            label: 'Edit Artisan Profile',
            href: `/dashboard/artisans/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form artisan={artisan} users={users} />
    </main>
  );
}