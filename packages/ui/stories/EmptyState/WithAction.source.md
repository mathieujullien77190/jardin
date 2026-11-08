```tsx
import { Button, EmptyState } from "@adopte-un-jardin/ui";

export const NoBooking = () => (
  <EmptyState
    emoji="🧺"
    title="Aucune réservation"
    text="Réservez une cueillette ou une parcelle pour la retrouver ici."
    action={<Button href="/">Explorer les jardins</Button>}
  />
);
```
