import { HeadersAdapter } from 'next/dist/server/web/spec-extension/adapters/headers';

declare global {
  interface HeadersAdapter {
    entries(): IterableIterator<[string, string]>;
  }
}
