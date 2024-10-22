import { defineDriver,normalizeKey } from "unstorage";

async function flattenAsyncIterable<T>(iterator: AsyncIterable<T>) {
  const items: T[] = [];
  for await (const item of iterator) {
    items.push(item);
  }
  return items;
}

const DRIVER_NAME = "deno-kv";

export default defineDriver<any>((options: any = {}) => {
  const { path, prefix: _prefix } = options;
  const prefix = normalizeKey(_prefix ? _prefix : "").split(":");
  let _client: Deno.Kv | undefined;

  const getClient = async (): Promise<Deno.Kv> => {
    if (!_client) {
      _client = await Deno.openKv(path);
    }
    return _client;
  };

  const r = (key: string): string[] => [...prefix, ...key.split(":")];
  const t = (key: readonly string[]): string =>
    key.slice(prefix.length).join(":");
  async function allKeys(kv: Deno.Kv) {
    const keys = (await flattenAsyncIterable(kv.list({ prefix }))).map(
      (response) => response.key
    );
    return keys;
  }
  return {
    name: DRIVER_NAME,
    options,
    async hasItem(key) {
      const kv = await getClient();
      const res = await kv.get(r(key));
      return !!res.value;
    },
    async getItem(key) {
      const kv = await getClient();
      const res = await kv.get(r(key));
      return res.value;
    },
    async setItem(key, value) {
      const kv = await getClient();
      await kv.set(r(key), value);
    },
    async removeItem(key) {
      const kv = await getClient();
      await kv.delete(r(key));
    },
    async getKeys() {
      const kv = await getClient();
      const keys = await allKeys(kv);
      // @ts-ignore They will be strings.
      return keys.map(t);
    },
    async clear() {
      const kv = await getClient();
      const keys = await allKeys(kv);
      const tx = kv.atomic();
      keys.forEach((key) => tx.delete(key));
      await tx.commit();
    },
    dispose() {
      if (_client) {
        _client.close();
      }
    },
  };
});