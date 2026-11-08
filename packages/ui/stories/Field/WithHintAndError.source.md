```tsx
import { Field } from "@adopte-un-jardin/ui";

export const Form = () => (
  <div className="w-80 space-y-4">
    <Field label="Téléphone" hint="Visible des membres connectés.">
      <input className="w-full rounded-xl border border-line px-3 py-2 text-sm" />
    </Field>
    <Field label="Titre" error="Titre requis.">
      <input className="w-full rounded-xl border border-line px-3 py-2 text-sm" />
    </Field>
  </div>
);
```
