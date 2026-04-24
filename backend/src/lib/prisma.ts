import { PrismaClient } from "@prisma/client";

let _client: PrismaClient | null = null;

function buildDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const u = new URL(url);
  if (u.hostname.includes("pooler.supabase.com")) {
    if (!u.searchParams.has("pgbouncer")) u.searchParams.set("pgbouncer", "true");
  }
  const isProd = process.env.NODE_ENV === "production";
  if (!u.searchParams.has("connection_limit")) {
    u.searchParams.set("connection_limit", isProd ? "15" : "5");
  }
  if (!u.searchParams.has("pool_timeout")) {
    u.searchParams.set("pool_timeout", "20");
  }
  return u.toString();
}

function build(): PrismaClient {
  // eslint-disable-next-line no-console
  console.log("[prisma] constructing PrismaClient on first query");
  const datasourceUrl = buildDatasourceUrl();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  });
}

function getClient(): PrismaClient {
  if (!_client) _client = build();
  return _client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function disconnectPrisma(): Promise<void> {
  if (_client) return _client.$disconnect();
  return Promise.resolve();
}
