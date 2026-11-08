import { Suspense } from 'react';
import ListingForm from '@/components/ListingForm';

const Page = () => (
  <Suspense>
    <ListingForm editing />
  </Suspense>
);

export default Page;
