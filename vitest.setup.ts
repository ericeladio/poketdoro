const memory = new Map<string, string>()

const localStoragePolyfill = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, String(value))
  },
  removeItem: (key: string) => {
    memory.delete(key)
  },
  clear: () => {
    memory.clear()
  },
  key: (index: number) => Array.from(memory.keys())[index] ?? null,
  get length() {
    return memory.size
  },
}

if (!('localStorage' in globalThis)) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStoragePolyfill,
    configurable: true,
  })
}
