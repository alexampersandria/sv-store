import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushSync } from 'svelte'
import { registerStore } from '$lib/registerStore.svelte'

function makeStore(initial: number) {
  let value = $state(initial)
  return {
    get value() {
      return value
    },
    set value(to: number) {
      value = to
    },
  }
}

describe('registerStore', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  describe('store key', () => {
    it('uses default prefix "sv-store"', () => {
      const store = makeStore(0)
      const cleanup = $effect.root(() => registerStore('counter', store))
      flushSync()
      expect(localStorage.getItem('sv-store:counter')).not.toBeNull()
      cleanup()
    })

    it('custom prefix', () => {
      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('counter', store, { prefix: 'my-app' }),
      )
      flushSync()
      expect(localStorage.getItem('my-app:counter')).not.toBeNull()
      cleanup()
    })

    it('omit prefix when null', () => {
      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('counter', store, { prefix: null }),
      )
      flushSync()
      expect(localStorage.getItem('counter')).not.toBeNull()
      expect(localStorage.getItem('sv-store:counter')).toBeNull()
      cleanup()
    })
  })

  describe('storage type', () => {
    it('localStorage (default)', () => {
      const store = makeStore(1)
      const cleanup = $effect.root(() => registerStore('x', store))
      flushSync()
      expect(localStorage.getItem('sv-store:x')).toBe('{"value":1}')
      cleanup()
    })

    it('sessionStorage', () => {
      const store = makeStore(7)
      const cleanup = $effect.root(() =>
        registerStore('x', store, { type: 'sessionStorage' }),
      )
      flushSync()
      expect(sessionStorage.getItem('sv-store:x')).toBe('{"value":7}')
      expect(localStorage.getItem('sv-store:x')).toBeNull()
      cleanup()
    })
  })

  describe('initial read', () => {
    it('hydrates from localStorage', () => {
      localStorage.setItem('sv-store:counter', JSON.stringify({ value: 42 }))

      const store = makeStore(0)
      const cleanup = $effect.root(() => registerStore('counter', store))
      flushSync()

      expect(store.value).toBe(42)
      cleanup()
    })

    it('does not persist a property that has no setter', () => {
      let value = $state(5)
      const readOnly = $state(22)
      const store = {
        get value() {
          return value
        },
        set value(to: number) {
          value = to
        },
        get readOnly() {
          return readOnly
        },
      }

      const cleanup = $effect.root(() => registerStore('s', store))
      flushSync()

      expect(localStorage.getItem('sv-store:s')).toBe('{"value":5}')
      cleanup()
    })

    it('persist readonly when persistReadOnly is true', () => {
      let value = $state(5)
      const readOnly = $state(22)
      const store = {
        get value() {
          return value
        },
        set value(to: number) {
          value = to
        },
        get readOnly() {
          return readOnly
        },
      }

      const cleanup = $effect.root(() =>
        registerStore('s', store, { persistReadOnly: true }),
      )
      flushSync()

      expect(localStorage.getItem('sv-store:s')).toBe(
        '{"value":5,"readOnly":22}',
      )
      cleanup()
    })

    it('localStorage takes precedence over initial value', () => {
      localStorage.setItem('sv-store:s', JSON.stringify({ value: 3 }))

      let value = 5

      const store = {
        get value() {
          return value
        },
        set value(to) {
          value = to
        },
      }

      const cleanup = $effect.root(() => registerStore('s', store))
      flushSync()

      expect(value).toBe(3)
      cleanup()
    })
  })

  describe('reactive write', () => {
    it('writes initial state', () => {
      const store = makeStore(3)
      const cleanup = $effect.root(() => registerStore('w', store))
      flushSync()

      expect(localStorage.getItem('sv-store:w')).toBe('{"value":3}')
      cleanup()
    })

    it('writes changes', () => {
      const store = makeStore(0)
      const cleanup = $effect.root(() => registerStore('w', store))
      flushSync()

      expect(localStorage.getItem('sv-store:w')).not.toBe('{"value":10}')

      flushSync(() => {
        store.value = 10
      })

      expect(localStorage.getItem('sv-store:w')).toBe('{"value":10}')
      cleanup()
    })

    it('does not write unchanged values', () => {
      localStorage.setItem('sv-store:w', '{"value":0}')

      const afterWrite = vi.fn()
      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('w', store, { afterWrite }),
      )
      flushSync()

      expect(afterWrite).not.toHaveBeenCalled()
      cleanup()
    })

    it('writes unchanged values when writeUnchanged is true', () => {
      localStorage.setItem('sv-store:w', '{"value":0}')

      const afterWrite = vi.fn()
      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('w', store, { writeUnchanged: true, afterWrite }),
      )
      flushSync()

      expect(afterWrite).toHaveBeenCalledOnce()
      cleanup()
    })
  })

  describe('tab synchronization', () => {
    it('re-reads the store when a storage event fires for the same key', () => {
      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('tab', store, { tabSynchronization: true }),
      )
      flushSync()

      localStorage.setItem('sv-store:tab', JSON.stringify({ value: 77 }))
      window.dispatchEvent(new StorageEvent('storage', { key: 'sv-store:tab' }))

      expect(store.value).toBe(77)
      cleanup()
    })

    it('does not add a storage listener when tabSynchronization is false', () => {
      const addSpy = vi.spyOn(window, 'addEventListener')

      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('tab', store, { tabSynchronization: false }),
      )
      flushSync()

      const storageListeners = addSpy.mock.calls.filter(
        ([event]) => event === 'storage',
      )
      expect(storageListeners).toHaveLength(0)
      cleanup()
    })
  })

  describe('callbacks', () => {
    it('beforeRead + afterRead', () => {
      localStorage.setItem('sv-store:cb', JSON.stringify({ value: 1 }))

      const order: string[] = []
      const beforeRead = vi.fn(() => order.push('before'))
      const afterRead = vi.fn(() => order.push('after'))

      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('cb', store, { beforeRead, afterRead }),
      )
      flushSync()

      expect(beforeRead).toHaveBeenCalledOnce()
      expect(afterRead).toHaveBeenCalledOnce()
      expect(order).toEqual(['before', 'after'])
      cleanup()
    })

    it('beforeWrite + afterWrite', () => {
      const order: string[] = []
      const beforeWrite = vi.fn(() => order.push('before'))
      const afterWrite = vi.fn(() => order.push('after'))

      const store = makeStore(1)
      const cleanup = $effect.root(() =>
        registerStore('cb', store, { beforeWrite, afterWrite }),
      )
      flushSync()

      expect(beforeWrite).toHaveBeenCalledOnce()
      expect(afterWrite).toHaveBeenCalledOnce()
      expect(order).toEqual(['before', 'after'])
      cleanup()
    })
  })

  describe('custom serialization', () => {
    it('custom serializer', () => {
      const serialize = vi.fn(() => 'custom-serialized')
      const store = makeStore(5)
      const cleanup = $effect.root(() =>
        registerStore('ser', store, { serialize }),
      )
      flushSync()

      expect(serialize).toHaveBeenCalled()
      expect(localStorage.getItem('sv-store:ser')).toBe('custom-serialized')
      cleanup()
    })

    it('custom deserializer', () => {
      localStorage.setItem('sv-store:ser', 'raw-data')

      const deserialize = vi.fn(() => ({ value: 99 }))
      const store = makeStore(0)
      const cleanup = $effect.root(() =>
        registerStore('ser', store, { deserialize }),
      )
      flushSync()

      expect(deserialize).toHaveBeenCalledWith('raw-data')
      expect(store.value).toBe(99)
      cleanup()
    })
  })
})
