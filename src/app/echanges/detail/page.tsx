import { Suspense } from 'react';
import PlantDetail from '@/components/PlantDetail';

const Page = () => (
  <Suspense>
    <PlantDetail />
  </Suspense>
);

export default Page;
