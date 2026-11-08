import Link from 'next/link';
import { GUIDE_ARTICLES, SEASON_CALENDAR, guideRoute } from '@/constants/guide';

export const GuidePage = () => (
  <div className="mx-auto max-w-4xl space-y-14">
    <header className="space-y-3">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Le guide du jardinier</h1>
      <p className="text-mute max-w-2xl text-lg leading-relaxed">
        Quatre guides pour tout comprendre : louer une parcelle, venir cueillir, proposer
        son jardin ou échanger des plantes.
      </p>
    </header>

    <section className="grid gap-6 sm:grid-cols-2">
      {GUIDE_ARTICLES.map((article) => (
        <Link
          key={article.slug}
          href={guideRoute(article.slug)}
          className="border-line bg-surface hover:border-brand group flex flex-col gap-3 rounded-3xl border p-7 transition hover:shadow-md"
        >
          <span className="bg-brand-soft grid h-14 w-14 place-items-center rounded-2xl text-3xl">
            {article.emoji}
          </span>
          <h2 className="text-xl font-bold">{article.title}</h2>
          <p className="text-mute leading-relaxed">{article.summary}</p>
          <span className="text-brand mt-auto pt-2 text-sm font-semibold">
            Lire le guide · {article.readTime} →
          </span>
        </Link>
      ))}
    </section>

    <section className="space-y-5">
      <h2 className="text-2xl font-bold">Que pousse-t-il et quand ?</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {SEASON_CALENDAR.map((item) => (
          <div
            key={item.season}
            className="border-line bg-surface rounded-2xl border border-dashed p-5"
          >
            <b className="text-lg">{item.season}</b>
            <p className="text-mute mt-1">{item.crops}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);
