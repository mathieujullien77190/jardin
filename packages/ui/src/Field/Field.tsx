import type { FieldProps } from './types';

const Field = ({ label, hint, error, children }: FieldProps) => (
  <label className="block text-sm">
    <span className="mb-1 block font-semibold">{label}</span>
    {children}
    {hint && !error && <span className="text-mute mt-1 block text-xs">{hint}</span>}
    {error && <span className="text-danger mt-1 block text-xs">{error}</span>}
  </label>
);

export default Field;
