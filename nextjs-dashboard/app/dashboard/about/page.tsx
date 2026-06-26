import { fetchDiscoverCatalog } from '@/app/lib/data';
import DiscoverFeed from '@/app/ui/discover/discover-feed';
import { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'About us',
};

export default async function Page() {
    return (
        <h1>About us</h1>
    )
}

