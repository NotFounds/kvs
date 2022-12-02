import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { KVS } from "./mod.ts";

Deno.test("Create KVS", () => {
  new KVS<number>();
});

Deno.test("Set a numeric value with a string key and get correct value by the key", () => {
  const kvs = new KVS<number>();
  kvs.set("foo", 42);

  assertEquals(kvs.has("foo"), true);
  assertEquals(kvs.get("foo"), 42);
});

Deno.test("Set a numeric value with a string key and remove a value by the key", () => {
  const kvs = new KVS<number>();
  kvs.set("foo", 42);

  kvs.delete("foo");

  assertEquals(kvs.has("foo"), false);
  assertEquals(kvs.get("foo"), undefined);
});

Deno.test("Clear kvs", () => {
  const kvs = new KVS<number>();
  kvs.set("foo", 42);
  kvs.set("bar", 42);
  kvs.clear();

  assertEquals(kvs.has("foo"), false);
  assertEquals(kvs.get("foo"), undefined);

  // able to clear multi times
  kvs.clear();
});

Deno.test("Set a value with expiration and it will be removed", async () => {
  const kvs = new KVS<number>();
  kvs.set("foo", 42, 200);
  assertEquals(kvs.has("foo"), true);

  // sleep 200ms
  await new Promise(resolve => setTimeout(resolve, 200));

  assertEquals(kvs.has("foo"), false);
});
