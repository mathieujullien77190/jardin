```tsx
import { useState } from "react";
import { Chip } from "@adopte-un-jardin/ui";

const OPTIONS = ["Outils", "Eau", "Toilettes"];

export const Filters = () => {
  const [selected, setSelected] = useState<string[]>(["Eau"]);
  const toggle = (option: string) =>
    setSelected((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );

  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => (
        <Chip
          key={option}
          label={option}
          active={selected.includes(option)}
          onClick={() => toggle(option)}
        />
      ))}
    </div>
  );
};
```
