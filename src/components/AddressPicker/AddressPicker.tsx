'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ADDRESS_DEBOUNCE_MS, ADDRESS_MIN_CHARS, INPUT_CLASS } from '@/constants';
import { searchAddresses } from '@/helpers/address';
import type { AddressResult } from '@/helpers/address';
import type { AddressPickerProps } from './types';

export const AddressPicker = ({
  value,
  placeholder = 'Saisissez une adresse…',
  onTextChange,
  onSelect,
}: AddressPickerProps) => {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [searching, setSearching] = useState(false);
  // Only search while the user types, not when a suggestion fills the field.
  const typing = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (!typing.current || value.trim().length < ADDRESS_MIN_CHARS) {
        setSuggestions([]);
        return;
      }
      setSearching(true);
      try {
        const results = await searchAddresses(value.trim(), controller.signal);
        setSuggestions(results);
        setActive(0);
        setOpen(true);
      } catch {
        // Aborted or offline: keep the previous suggestions.
      } finally {
        setSearching(false);
      }
    }, ADDRESS_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const choose = (result: AddressResult): void => {
    typing.current = false;
    setOpen(false);
    setSuggestions([]);
    onSelect(result);
  };

  return (
    <div className="relative">
      <input
        className={INPUT_CLASS}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(event) => {
          typing.current = true;
          onTextChange(event.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={(event) => {
          if (!open || suggestions.length === 0) return;
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActive((index) => (index + 1) % suggestions.length);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActive((index) => (index - 1 + suggestions.length) % suggestions.length);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            choose(suggestions[active]);
          } else if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      {searching && (
        <span className="text-mute pointer-events-none absolute top-2.5 right-3 text-xs">
          Recherche…
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="border-line bg-surface absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border p-1 shadow-lg"
        >
          {suggestions.map((result, index) => (
            <li
              key={`${result.label}-${index}`}
              role="option"
              aria-selected={index === active}
            >
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(result)}
                className={`flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm ${
                  index === active ? 'bg-brand-soft' : 'hover:bg-brand-soft'
                }`}
              >
                <span className="font-semibold">{result.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
