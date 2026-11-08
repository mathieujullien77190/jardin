```tsx
import { Button } from "@adopte-un-jardin/ui";

export const Actions = () => (
  <div className="flex gap-3">
    <Button>Réserver</Button>
    <Button variant="accent">Publier une annonce</Button>
    <Button variant="ghost">Annuler</Button>
    <Button variant="danger">Supprimer</Button>
    <Button small>Petit</Button>
    <Button disabled>Indisponible</Button>
  </div>
);
```
