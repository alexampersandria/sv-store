/* eslint-disable @typescript-eslint/no-explicit-any */
import { untrack } from 'svelte'

export type SvStoreType = 'localStorage' | 'sessionStorage'

export type SvStoreOptions = {
  type?: SvStoreType
  prefix?: string | null
  tabSynchronization?: boolean
  writeUnchanged?: boolean
  persistReadOnly?: boolean
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
  beforeRead?: (state: any) => void
  afterRead?: (state: any) => void
  beforeWrite?: (state: any) => void
  afterWrite?: (state: any) => void
}

const DEFAULT_OPTIONS: SvStoreOptions = {
  type: 'localStorage',
  prefix: 'sv-store',
  tabSynchronization: false,
  writeUnchanged: false,
  persistReadOnly: false,
  serialize: value => JSON.stringify(value),
  deserialize: value => JSON.parse(value),
}

/**
 * registers an sv-store with localStorage or sessionStorage persistence
 */
export const registerStore = (
  name: string,
  store: any,
  options?: SvStoreOptions,
) => {
  if (typeof window === 'undefined') return

  const config = { ...DEFAULT_OPTIONS, ...options }

  const key = config.prefix ? `${config.prefix}:${name}` : name
  const space = config.type === 'sessionStorage' ? sessionStorage : localStorage

  const storeEffect = (state: any) => {
    if (!config.serialize) return

    let copy: Record<string, any>
    if (config.persistReadOnly) {
      copy = { ...state }
    } else {
      copy = {}
      for (const k in state) {
        const props = Object.getOwnPropertyDescriptor(state, k)
        if (props?.set) {
          copy[k] = state[k]
        }
      }
    }
    const serialized = config.serialize(copy)
    const currentStored = space.getItem(key)
    if (serialized === currentStored && !config.writeUnchanged) return

    untrack(() => config.beforeWrite?.(store))

    space.setItem(key, serialized)
    untrack(() => config.afterWrite?.(store))
  }

  const readStore = () => {
    if (!config.deserialize) return

    untrack(() => config.beforeRead?.(store))

    const stored = space.getItem(key)

    if (stored) {
      const state = config.deserialize(stored)
      for (const key in state) {
        if (store[key] !== state[key]) {
          const properties = Object.getOwnPropertyDescriptor(store, key)
          if (properties?.set) {
            store[key] = state[key]
          }
        }
      }
    }

    untrack(() => config.afterRead?.(store))
  }

  const storageEvent = (event: StorageEvent) => {
    if (event.key === key) readStore()
  }

  readStore()

  if (config.tabSynchronization) {
    window.addEventListener('storage', storageEvent)
  }

  $effect(() => storeEffect(store))
}
