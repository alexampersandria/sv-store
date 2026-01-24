/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMount, untrack } from 'svelte'

export type SvStoreType = 'localStorage' | 'sessionStorage'

export type SvStoreOptions = {
  type?: SvStoreType
  prefix?: string | null
  beforeRead?: (state: any) => void
  afterRead?: (state: any) => void
  beforeWrite?: (state: any) => void
  afterWrite?: (state: any) => void
}

/**
 * registers an sv-store with localStorage persistence
 * @param name The name of the store
 * @param store The store object to register
 * @param options Options for the store
 */
export const registerStore = (
  name: string,
  store: any,
  options?: SvStoreOptions,
) => {
  let mounted: boolean = false

  let prefix = options?.prefix
  if (prefix === undefined) prefix = 'sv-store'
  const storeName = prefix ? `${prefix}:${name}` : name

  const storeEffect = (updatedStore: any) => {
    untrack(() => options?.beforeWrite?.(store))

    const storeObject: { [key: string]: any } = {}
    const keys = Object.keys(updatedStore)
    keys.forEach(key => {
      storeObject[key] = (updatedStore as { [key: string]: any })[key]
    })
    if (mounted) {
      if (options?.type === 'localStorage' || !options?.type) {
        localStorage.setItem(storeName, JSON.stringify(storeObject))
      } else if (options?.type === 'sessionStorage') {
        sessionStorage.setItem(storeName, JSON.stringify(storeObject))
      }
    }

    untrack(() => options?.afterWrite?.(store))
  }

  const readStore = () => {
    untrack(() => options?.beforeRead?.(store))

    let stored: string | null = null
    if (options?.type === 'localStorage' || !options?.type) {
      stored = localStorage.getItem(storeName)
    } else if (options?.type === 'sessionStorage') {
      stored = sessionStorage.getItem(storeName)
    }

    if (stored) {
      const storedObject = JSON.parse(stored)
      const keys = Object.keys(storedObject)
      keys.forEach(key => {
        if (store[key] !== storedObject[key]) {
          const properties = Object.getOwnPropertyDescriptor(store, key)
          // if property has setter
          if (properties?.set) {
            store[key] = storedObject[key]
          }
        }
      })
    }

    untrack(() => options?.afterRead?.(store))
  }

  onMount(() => {
    readStore()
    mounted = true
  })

  $effect(() => {
    storeEffect(store)
  })
}
