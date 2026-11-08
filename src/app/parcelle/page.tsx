import { Suspense } from 'react';
import ListingDetail from '@/components/ListingDetail';

const Page = () => (
  <Suspense>
    <ListingDetail />
  </Suspense>
);

export default Page;
