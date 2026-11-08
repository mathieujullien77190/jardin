import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDE_ARTICLES, findGuideArticle, guideRoute } from '@/constants/guide';
import { ROUTES } from '@/constants';
import Button from '../ui/Button';
import type { GuideArticleProps } from './types';

export const GuideArticle = ({ slug }: GuideArticleProps) => {
  const article = findGuideArticle(slug);
  if (!article) notFound();
  const others = GUIDE_ARTICLES.filter((candidate) => candidate.slug !== article.slug);

  return (
    <article className="mx-auto max-w-3xl space-y-14">
      <header className="space-y-5">
        <Link href={ROUTES.guide} className="text-brand text-sm font-semibold">
          ← Tous les guides
        </Link>
        <div className="flex items-center gap-4">
          <span className="bg-brand-soft grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl">
            {article.emoji}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{article.title}</h1>
            <p className="text-mute mt-1 text-sm">Lecture · {article.readTime}</p>
          </div>
        </div>
        <p className="text-mute text-lg leading-relaxed">{article.summary}</p>
      </header>

      <nav
        aria-label="Sommaire"
        className="border-line bg-surface rounded-2xl border p-6"
      >
        <p className="text-mute mb-3 text-xs font-bold tracking-wide uppercase">
          Dans ce guide
        </p>
        <ol className="space-y-2">
          {article.sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="hover:text-brand flex gap-3">
                <span className="text-brand w-5 font-bold">{index + 1}</span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-14">
        {article.sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 space-y-5">
            <h2 className="flex items-center gap-3 text-2xl font-bold">
              <span className="bg-brand grid h-9 w-9 shrink-0 place-items-center rounded-full text-base text-white">
                {index + 1}
              </span>
              {section.title}
            </h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="text-[17px] leading-8">
                {paragraph}
              </p>
            ))}

            {section.steps && (
              <ol className="space-y-4">
                {section.steps.map((step, stepIndex) => (
                  <li
                    key={step.title}
                    className="border-line bg-surface flex gap-4 rounded-2xl border p-5"
                  >
                    <span className="bg-brand-soft text-brand-dark grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold">
                      {stepIndex + 1}
                    </span>
                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-mute mt-1 leading-relaxed">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {section.bullets && (
              <ul className="space-y-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 leading-7">
                    <span className="bg-brand mt-3 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.tip && (
              <aside className="bg-brand-soft rounded-2xl p-5 leading-7">
                <b className="text-brand-dark">💡 Astuce · </b>
                {section.tip}
              </aside>
            )}

            {section.note && (
              <aside className="rounded-2xl border border-orange-200 bg-orange-50 p-5 leading-7 text-orange-900">
                <b>⚠️ À savoir · </b>
                {section.note}
              </aside>
            )}
          </section>
        ))}
      </div>

      <section className="bg-brand-dark flex flex-wrap items-center justify-between gap-5 rounded-3xl p-8 text-white">
        <div>
          <h2 className="text-xl font-bold">Prêt à vous lancer ?</h2>
          <p className="mt-1 text-sm opacity-90">
            Tout se passe dans l’appli, en quelques clics.
          </p>
        </div>
        <Button variant="accent" href={article.ctaHref}>
          {article.ctaLabel}
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">À lire aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={guideRoute(other.slug)}
              className="border-line bg-surface hover:border-brand rounded-2xl border p-5 transition"
            >
              <span className="text-2xl">{other.emoji}</span>
              <p className="mt-2 font-bold">{other.title}</p>
              <p className="text-mute text-sm">{other.readTime}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};
