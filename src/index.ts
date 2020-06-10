
export type SortKey = number | string | Date | ArrayBuffer | ArrayBufferView | Array<SortKey>;

export const enum SortKeyType {
  NUMBER = 0,
  DATE = 1,
  STRING = 2,
  BINARY = 3,
  ARRAY = 4,
}

function getSortKeyType(sortKey: SortKey): SortKeyType {
  if (typeof sortKey === 'string') return SortKeyType.STRING;
  if (typeof sortKey === 'number') return SortKeyType.NUMBER;
  if (typeof sortKey === 'object') {
    if (Array.isArray(sortKey)) return SortKeyType.ARRAY;
    if (sortKey instanceof Date) return SortKeyType.DATE;
    if (sortKey instanceof ArrayBuffer) return SortKeyType.BINARY;
    if (ArrayBuffer.isView(sortKey)) return SortKeyType.BINARY;
  } 
  throw new Error('invalid sort key');
}

export function sortKeyCompare(a: SortKey, b: SortKey): number {
  const aType = getSortKeyType(a), bType = getSortKeyType(b);
  if (aType !== bType) return Math.sign(aType - bType);
  switch (aType) {
    case SortKeyType.NUMBER:
    case SortKeyType.DATE: {
      return Math.sign(+a - +b);
    }
    case SortKeyType.STRING: {
      const aStr = a as string, bStr = b as string;
      const length = Math.min(aStr.length, bStr.length);
      for (let i = 0; i < length; i++) {
        let c = Math.sign(aStr.charCodeAt(i) - bStr.charCodeAt(i));
        if (c !== 0) return c;
      }
      return Math.sign(aStr.length - bStr.length);
    }
    case SortKeyType.BINARY: {
      const aBytes = (a instanceof ArrayBuffer) ? new Uint8Array(a) 
                    : (a instanceof Uint8Array) ? a
                    : new Uint8Array(
                        (a as ArrayBufferView).buffer,
                        (a as ArrayBufferView).byteOffset,
                        (a as ArrayBufferView).byteLength);
      const bBytes = (b instanceof ArrayBuffer) ? new Uint8Array(b) 
                    : (b instanceof Uint8Array) ? b
                    : new Uint8Array(
                        (b as ArrayBufferView).buffer,
                        (b as ArrayBufferView).byteOffset,
                        (b as ArrayBufferView).byteLength);
      const length = Math.min(aBytes.length, bBytes.length);
      for (let i = 0; i < length; i++) {
        const cmp = Math.sign(aBytes[i] - bBytes[i]);
        if (cmp !== 0) return cmp;
      }
      return Math.sign(aBytes.length - bBytes.length);
    }
    case SortKeyType.ARRAY: {
      const aKeys = a as SortKey[], bKeys = b as SortKey[];
      const length = Math.min(aKeys.length, bKeys.length);
      for (let i = 0; i < length; i++) {
        const c = sortKeyCompare(aKeys[i], bKeys[i]);
        if (c !== 0) return c;
      }
      return Math.sign(aKeys.length - bKeys.length);
    }
  }
}

export const LOWEST_KEY: SortKey = -Infinity;
