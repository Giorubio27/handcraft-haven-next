// app/lib/placeholder-data.ts

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Haven Admin',
    email: 'admin@handcrafthaven.com',
    password: 'securepassword123', // Will be hashed by bcrypt
  },
];

const artisans = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Elena Rostova',
    email: 'elena@rostovaceramics.com',
    bio: 'Master ceramicist specializing in wheel-thrown stoneware and crystalline glazes.',
    image_url: '/artisans/elena-rostova.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Marcus Vance',
    email: 'marcus@vancewoodwork.com',
    bio: 'Hand-carving heirloom furniture from sustainably sourced local hardwoods.',
    image_url: '/artisans/marcus-vance.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Amina Mansoor',
    email: 'amina@wovenhistory.com',
    bio: 'Third-generation textile artist practicing traditional indigo dying and handloom weaving.',
    image_url: '/artisans/amina-mansoor.png',
  },
];

const collections = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    artisan_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', // Elena
    name: 'Earth & Ember',
    description: 'Rustic, raw-clay exterior mugs and bowls designed for daily rituals.',
  },
  {
    id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e',
    artisan_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', // Marcus
    name: 'Live Edge Serenity',
    description: 'Stunning walnut and cherry dining tables preserving the natural silhouette of the tree.',
  },
  {
    id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    artisan_id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', // Amina
    name: 'Deep Indigo Skies',
    description: 'Heritage wall tapestries and throw pillows dyed with organic plant matter.',
  },
];

const invoices = [
  {
    artisan_id: artisans[0].id,
    amount: 12500, // $125.00
    status: 'paid',
    date: '2026-05-12',
  },
  {
    artisan_id: artisans[1].id,
    amount: 240000, // $2,400.00
    status: 'pending',
    date: '2026-06-01',
  },
  {
    artisan_id: artisans[2].id,
    amount: 45000, // $450.00
    status: 'paid',
    date: '2026-05-28',
  },
  {
    artisan_id: artisans[0].id,
    amount: 8500, // $85.00
    status: 'pending',
    date: '2026-06-05',
  },
];

export { users, artisans, collections, invoices };