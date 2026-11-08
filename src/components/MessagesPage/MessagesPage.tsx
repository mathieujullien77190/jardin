'use client';

import { useState } from 'react';
import { INPUT_CLASS, ROUTES } from '@/constants';
import { formatDateTime } from '@/helpers/format';
import { useApp } from '@/hooks/useApp';
import RequireAuth from '../RequireAuth';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { buildThreads } from './helpers';

const Content = () => {
  const { db, user, sendMessage } = useApp();
  const [selected, setSelected] = useState('');
  const [text, setText] = useState('');
  if (!user) return null;

  const threads = buildThreads(db.messages, user.id);
  const current = threads.find((thread) => thread.key === selected) ?? threads[0];

  if (threads.length === 0) {
    return (
      <EmptyState
        emoji="💬"
        title="Aucun message"
        text="Contactez un propriétaire depuis la fiche d’un jardin."
        action={<Button href={ROUTES.home}>Explorer</Button>}
      />
    );
  }

  const nameOf = (id: string): string =>
    db.users.find((candidate) => candidate.id === id)?.name ?? 'Membre';
  const titleOf = (id: string): string =>
    db.listings.find((candidate) => candidate.id === id)?.title ?? 'Annonce supprimée';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Messages</h1>
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <ul className="min-w-0 space-y-2">
          {threads.map((thread) => (
            <li key={thread.key} className="min-w-0">
              <button
                type="button"
                onClick={() => setSelected(thread.key)}
                className={`w-full overflow-hidden rounded-xl border p-3 text-left text-sm ${
                  thread.key === current?.key
                    ? 'border-brand bg-brand-soft'
                    : 'border-line bg-surface'
                }`}
              >
                <b>{nameOf(thread.otherId)}</b>
                <span className="text-mute block text-xs">
                  {titleOf(thread.listingId)}
                </span>
                <span className="text-mute block truncate">{thread.last.text}</span>
              </button>
            </li>
          ))}
        </ul>

        {current && (
          <div className="border-line bg-surface flex min-h-80 min-w-0 flex-col rounded-2xl border p-4">
            <p className="border-line mb-3 border-b pb-2 text-sm font-semibold">
              {nameOf(current.otherId)} · {titleOf(current.listingId)}
            </p>
            <ul className="flex-1 space-y-2">
              {current.messages.map((message) => {
                const mine = message.fromId === user.id;
                return (
                  <li key={message.id} className={mine ? 'text-right' : ''}>
                    <span
                      className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-left text-sm ${
                        mine ? 'bg-brand text-white' : 'bg-line'
                      }`}
                    >
                      {message.text}
                    </span>
                    <span className="text-mute block text-[10px]">
                      {formatDateTime(message.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(current.listingId, current.otherId, text);
                setText('');
              }}
            >
              <input
                className={INPUT_CLASS}
                placeholder="Votre message…"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
              <Button type="submit" disabled={!text.trim()}>
                Envoyer
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const MessagesPage = () => (
  <RequireAuth>
    <Content />
  </RequireAuth>
);
