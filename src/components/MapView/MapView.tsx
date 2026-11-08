import { buildBubbles } from './helpers';
import type { MapViewProps } from './types';

export const MapView = ({ counts, selectedCity, onSelectCity }: MapViewProps) => {
  const bubbles = buildBubbles(counts);
  return (
    <div
      className="border-line bg-brand-soft relative aspect-[4/3] w-full overflow-hidden rounded-2xl border"
      style={{
        backgroundImage:
          'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
        backgroundSize: '12.5% 12.5%',
      }}
      role="group"
      aria-label="Carte des jardins"
    >
      {bubbles.map((bubble) => {
        const selected = bubble.name === selectedCity;
        return (
          <button
            key={bubble.name}
            type="button"
            title={`${bubble.name} · ${bubble.count} jardin(s)`}
            onClick={() => onSelectCity(selected ? '' : bubble.name)}
            className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-sm font-bold shadow transition hover:scale-110 ${
              selected
                ? 'border-ink bg-accent text-ink'
                : 'border-brand bg-surface/90 text-brand-dark'
            }`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
            }}
          >
            {bubble.count}
            <span className="text-ink pointer-events-none absolute top-full mt-0.5 text-[10px] font-semibold whitespace-nowrap">
              {bubble.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
