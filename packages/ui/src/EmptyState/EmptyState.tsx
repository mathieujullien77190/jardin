import type { EmptyStateProps } from './types';

const EmptyState = ({ emoji, title, text, action }: EmptyStateProps) => (
  <div className="border-line bg-surface rounded-2xl border border-dashed px-6 py-14 text-center">
    <div className="text-5xl">{emoji}</div>
    <h2 className="mt-3 text-lg font-bold">{title}</h2>
    {text && <p className="text-mute mx-auto mt-1 max-w-md text-sm">{text}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
