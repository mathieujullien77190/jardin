import GuideArticle from '@/components/GuideArticle';
import { GUIDE_ARTICLES } from '@/constants/guide';

// Static export: only the known guides are generated.
export const dynamicParams = false;

export const generateStaticParams = (): { slug: string }[] =>
  GUIDE_ARTICLES.map((article) => ({ slug: article.slug }));

const Page = async ({ params }: PageProps<'/guide/[slug]'>) => {
  const { slug } = await params;
  return <GuideArticle slug={slug} />;
};

export default Page;
