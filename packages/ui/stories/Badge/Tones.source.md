```tsx
import { Badge } from "@adopte-un-jardin/ui";

export const Statuses = () => (
  <div className="flex gap-2">
    <Badge tone="green">Validée</Badge>
    <Badge tone="orange">Payée · à valider</Badge>
    <Badge tone="red">Annulée</Badge>
    <Badge>Brouillon</Badge>
  </div>
);
```
