// deno-lint-ignore-file no-explicit-any
type Key = string | symbol | number;

interface IKVS<T> {
  set(key: Key, value: T, expires?: number): void;
  get(key: Key): T | undefined;
  has(key: Key): boolean;
  delete(key: Key): void;
  clear(): void;
}

type InternalObject<T> = {
  _objectId: string;
  value: T;
  updatedAt: number;
}

export class KVS<T = any> implements IKVS<T> {
  private internalObjects: Record<Key, InternalObject<T>> = {};
  public constructor() {
  }

  /**
   * Set key to hold the value. If key already holds a value, it's overwritten.
   * @param expires Set the specified expire time in milliseconds. Default is undefined and no expiration.
   */
  set(key: Key, value: T, expires?: number) {
    const objectId = window.crypto.randomUUID();
    this.internalObjects[key] = {
      _objectId: objectId,
      value,
      updatedAt: (new Date()).getTime(),
    }
    if (expires && expires > 0) {
      setTimeout(() => {
        if (this.internalObjects[key]?._objectId === objectId) {
          delete this.internalObjects[key];
        }
      }, expires);
    }
  }

  /**
   * Get the value of key. If the key doesn't exist, returns undefined.
   */
  get(key: Key): T | undefined {
    return this.internalObjects[key]?.value;
  }

  /**
   * Returns if key exists.
   */
  has(key: Key): boolean {
    return key in this.internalObjects;
  }

  /**
   * Removes the specified key. A key is ignored if it doesn't exist.
   */
  delete(key: Key) {
    delete this.internalObjects[key];
  }

  /**
   * Removes all key-values.
   */
  clear() {
    this.internalObjects = {};
  }
}
