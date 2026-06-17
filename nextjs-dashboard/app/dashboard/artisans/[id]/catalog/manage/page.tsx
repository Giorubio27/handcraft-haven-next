// app/dashboard/artisans/[id]/catalog/manage/page.tsx
import Breadcrumbs from '@/app/ui/artisans/breadcrumbs';
import AddCatalogItemForm from '@/app/ui/artisans/add-catalog-form';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <main className="max-w-2xl mx-auto p-4 md:p-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Artisans', href: '/dashboard/artisans' },
          { label: 'Profile', href: `/dashboard/artisans/${id}` },
          { label: 'Manage Catalog', href: `/dashboard/artisans/${id}/catalog/manage`, active: true },
        ]}
      />

      {/* Render the clean client form component down below */}
      <AddCatalogItemForm artisanId={id} />
      
    </main>
  );
}