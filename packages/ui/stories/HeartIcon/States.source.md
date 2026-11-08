```tsx
import { useState } from "react";
import { HeartIcon } from "@adopte-un-jardin/ui";

export const FavoriteButton = () => {
  const [favorite, setFavorite] = useState(false);
  return (
    <button
      type="button"
      aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={() => setFavorite((value) => !value)}
    >
      <HeartIcon filled={favorite} className="h-8 w-8" />
    </button>
  );
};
```
