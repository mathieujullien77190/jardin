import { Suspense } from 'react';
import PlantForm from '@/components/PlantForm';

const Page = () => (
  <Suspense>
    <PlantForm editing />
  </Suspense>
);

export default Page;
