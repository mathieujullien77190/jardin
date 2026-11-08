import type { Message } from '@/types';

export type Thread = {
  key: string;
  listingId: string;
  otherId: string;
  messages: Message[];
  last: Message;
};

export const buildThreads = (messages: Message[], userId: string): Thread[] => {
  const map = new Map<string, Thread>();
  messages
    .filter((message) => message.fromId === userId || message.toId === userId)
    .forEach((message) => {
      const otherId = message.fromId === userId ? message.toId : message.fromId;
      const key = `${message.listingId}:${otherId}`;
      const existing = map.get(key);
      if (existing) {
        existing.messages.push(message);
        existing.last = message;
      } else {
        map.set(key, {
          key,
          listingId: message.listingId,
          otherId,
          messages: [message],
          last: message,
        });
      }
    });
  return [...map.values()].sort((a, b) =>
    b.last.createdAt.localeCompare(a.last.createdAt),
  );
};
