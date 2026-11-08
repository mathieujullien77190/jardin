import { ROUTES } from '@/constants';
import ListingExplorer from '../ListingExplorer';
import Button from '../ui/Button';
import { STEPS } from './constants';

export const HomePage = () => (
  <div className="space-y-10 sm:space-y-12">
    <section className="from-brand-soft rounded-3xl bg-gradient-to-b to-transparent px-4 py-8 text-center sm:py-12">
      <h1 className="mx-auto max-w-2xl text-2xl font-extrabold sm:text-5xl">
        Un jardin près de chez vous, pour cultiver ou cueillir
      </h1>
      <p className="text-mute mx-auto mt-3 max-w-xl">
        Louez une parcelle le temps d’une saison, ou venez cueillir fruits et légumes chez
        des particuliers.
      </p>
    </section>

    <section
      aria-label="Comment ça marche"
      className="grid gap-3 sm:grid-cols-3 sm:gap-5"
    >
      {STEPS.map((step, index) => (
        <div
          key={step.title}
          className="border-line bg-surface flex items-start gap-4 rounded-2xl border p-4 sm:p-5"
        >
          <div className="bg-brand grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold text-white">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold">{step.title}</h3>
            <p className="text-mute mt-0.5 text-sm leading-snug">{step.text}</p>
          </div>
        </div>
      ))}
    </section>

    <ListingExplorer />

    <section className="bg-brand-dark flex flex-wrap items-center justify-between gap-4 rounded-3xl p-8 text-white">
      <div>
        <h2 className="text-2xl font-bold">Vous avez un jardin inutilisé ?</h2>
        <p className="mt-1 text-sm opacity-90">
          Proposez-le en location ou en cueillette.
        </p>
      </div>
      <Button variant="accent" href={ROUTES.newListing}>
        Publier une annonce
      </Button>
    </section>
  </div>
);
