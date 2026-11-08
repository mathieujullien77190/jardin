'use client';

import { useState } from 'react';
import { INPUT_CLASS } from '@/constants';
import Button from '../ui/Button';
import type { ContactBoxProps } from './types';

export const ContactBox = ({ ownerName, disabled, onSend }: ContactBoxProps) => {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText('');
        setSent(true);
      }}
    >
      <h3 className="font-bold">Écrire à {ownerName}</h3>
      <textarea
        rows={3}
        disabled={disabled}
        className={INPUT_CLASS}
        placeholder={
          disabled
            ? 'Connectez-vous pour envoyer un message'
            : 'Bonjour, est-il possible de…'
        }
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setSent(false);
        }}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" variant="ghost" small disabled={disabled || !text.trim()}>
          Envoyer
        </Button>
        {sent && <span className="text-brand text-xs">Message envoyé ✔</span>}
      </div>
    </form>
  );
};
