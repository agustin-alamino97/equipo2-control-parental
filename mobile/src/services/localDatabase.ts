import type * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import type { QueuedEvent } from '../types';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
const browserSnapshots = new Map<string, string>();
const browserEvents = new Map<string, { payload: string; createdAt: string }>();
const browserPendingRules = new Set<string>();

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = import('expo-sqlite').then(({ openDatabaseAsync }) => (
      openDatabaseAsync('protege-mas.db')
    )).then(async (database) => {
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS snapshots (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS offline_events (
          id TEXT PRIMARY KEY NOT NULL,
          device_uuid TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS pending_rules (
          domain TEXT PRIMARY KEY NOT NULL,
          rule_type TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
      return database;
    });
  }
  return databasePromise;
}

export async function saveSnapshot<T>(key: string, value: T): Promise<void> {
  if (Platform.OS === 'web') {
    browserSnapshots.set(key, JSON.stringify(value));
    return;
  }
  const database = await openDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO snapshots (key, value, updated_at) VALUES (?, ?, ?)',
    key,
    JSON.stringify(value),
    new Date().toISOString(),
  );
}

export async function readSnapshot<T>(key: string): Promise<T | null> {
  if (Platform.OS === 'web') {
    const value = browserSnapshots.get(key);
    return value === undefined ? null : JSON.parse(value) as T;
  }
  const database = await openDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM snapshots WHERE key = ?',
    key,
  );
  return row ? (JSON.parse(row.value) as T) : null;
}

export async function enqueueEvent(event: QueuedEvent): Promise<void> {
  if (Platform.OS === 'web') {
    if (!browserEvents.has(event.id)) {
      browserEvents.set(event.id, { payload: JSON.stringify(event), createdAt: new Date().toISOString() });
    }
    return;
  }
  const database = await openDatabase();
  await database.runAsync(
    'INSERT OR IGNORE INTO offline_events (id, device_uuid, payload, created_at) VALUES (?, ?, ?, ?)',
    event.id,
    event.device_uuid,
    JSON.stringify(event),
    new Date().toISOString(),
  );
}

export async function readQueuedEvents(): Promise<QueuedEvent[]> {
  if (Platform.OS === 'web') {
    return [...browserEvents.values()]
      .sort((first, second) => first.createdAt.localeCompare(second.createdAt))
      .map(({ payload }) => JSON.parse(payload) as QueuedEvent);
  }
  const database = await openDatabase();
  const rows = await database.getAllAsync<{ payload: string }>(
    'SELECT payload FROM offline_events ORDER BY created_at ASC',
  );
  return rows.map(({ payload }) => JSON.parse(payload) as QueuedEvent);
}

export async function removeQueuedEvents(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  if (Platform.OS === 'web') {
    for (const id of ids) browserEvents.delete(id);
    return;
  }
  const database = await openDatabase();
  const placeholders = ids.map(() => '?').join(', ');
  await database.runAsync(
    `DELETE FROM offline_events WHERE id IN (${placeholders})`,
    ...ids,
  );
}

export async function enqueueRule(domain: string): Promise<void> {
  if (Platform.OS === 'web') {
    browserPendingRules.add(domain);
    return;
  }
  const database = await openDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO pending_rules (domain, rule_type, created_at) VALUES (?, ?, ?)',
    domain,
    'domain',
    new Date().toISOString(),
  );
}

export async function readPendingRules(): Promise<string[]> {
  if (Platform.OS === 'web') return [...browserPendingRules];
  const database = await openDatabase();
  const rows = await database.getAllAsync<{ domain: string }>(
    'SELECT domain FROM pending_rules ORDER BY created_at ASC',
  );
  return rows.map(({ domain }) => domain);
}

export async function removePendingRule(domain: string): Promise<void> {
  if (Platform.OS === 'web') {
    browserPendingRules.delete(domain);
    return;
  }
  const database = await openDatabase();
  await database.runAsync('DELETE FROM pending_rules WHERE domain = ?', domain);
}
