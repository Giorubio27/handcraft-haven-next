import Form from '@/app/ui/artisans/create-form';
import Breadcrumbs from '@/app/ui/artisans/breadcrumbs';
import { fetchUsers } from '@/app/lib/data';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Artisan',
};
export default async function Page() {
  const users = await fetchUsers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Artisans', href: '/dashboard/artisans' },
          {
            label: 'Create Artisan',
            href: '/dashboard/artisans/create',
            active: true,
          },
        ]}
      />
      <Form users={users} />
    </main>
  );
}