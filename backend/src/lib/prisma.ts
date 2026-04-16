// Lazy Prisma client.
//
// PrismaClient is constructed on FIRST use, not on module load. This keeps
// the boot path clean — module imports across the route tree don't trigger
// engine initialisation. Any failure (binary missing, env var malformed,
// schema mismatch) surfaces on the first query rather than at startup,
// which means the process can `app.listen()` and serve /health even if the
// DB layer is broken.

import { PrismaClient } from "@prisma/client";

let _client: PrismaClient | null = null;

function build(): PrismaClient {
  // eslint-disable-next-line no-console
  console.log("[prisma] constructing PrismaClient on first query");
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!_client) _client = build();
  return _client;
}

// Proxy preserves the `prisma.word.findFirst()` syntax everywhere without
// needing to update callers. Property access (and `then`/await) lazily
// instantiates the underlying client.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
