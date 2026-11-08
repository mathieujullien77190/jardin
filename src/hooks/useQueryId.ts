'use client';

import { useSearchParams } from 'next/navigation';

// Static export: record ids travel in the query string (?id=...).
export const useQueryId = (): string | null => useSearchParams().get('id');
