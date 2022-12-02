import { KVS } from "./mod.ts";

Deno.bench(".set (insert 1,000,000 keys)", () => {
  const kvs = new KVS<number>();
  for (let i = 0; i < 1000000; i++) {
    kvs.set(i.toString(), i);
  }
});
