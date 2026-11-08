import { GUIDE_SECTIONS, SEASON_CALENDAR } from './constants';

export const GuidePage = () => (
  <div className="mx-auto max-w-3xl space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold">Guide du jardinier</h1>
      <p className="text-mute mt-1">Tout comprendre en quelques minutes.</p>
    </div>

    {GUIDE_SECTIONS.map((section) => (
      <section
        key={section.title}
        className="border-line bg-surface rounded-2xl border p-6"
      >
        <h2 className="text-xl font-bold">
          {section.emoji} {section.title}
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    ))}

    <section>
      <h2 className="mb-3 text-xl font-bold">Que pousse-t-il et quand ?</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {SEASON_CALENDAR.map((item) => (
          <div
            key={item.season}
            className="border-line bg-surface rounded-xl border border-dashed p-4"
          >
            <b>{item.season}</b>
            <p className="text-mute text-sm">{item.crops}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);
