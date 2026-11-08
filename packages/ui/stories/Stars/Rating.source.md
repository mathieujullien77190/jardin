```tsx
import { useState } from "react";
import { Stars } from "@adopte-un-jardin/ui";

export const ReviewForm = () => {
  const [rating, setRating] = useState(4);
  return (
    <div className="space-y-2">
      <Stars value={rating} onChange={setRating} />
      <p>Aperçu en lecture seule :</p>
      <Stars value={rating} />
    </div>
  );
};
```
