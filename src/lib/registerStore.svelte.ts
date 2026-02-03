/* eslint-disable @typescript-eslint/no-explicit-any */
import { watch } from 'runed'
import { onMount, untrack } from 'svelte'

export type SvStoreType = 'localStorage' | 'sessionStorage'

export type SvStoreOptions = {
  type?: SvStoreType
  prefix?: string | null
  beforeRead?: (state: any) => void
  afterRead?: (state: any) => void
  beforeWrite?: (state: any) => void
  afterWrite?: (state: any) => void
  debounce?: number
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

  let mounted: boolean = false

  const prefix =
    options?.prefix === null ? null : (options?.prefix ?? 'sv-store')
  const key = prefix ? `${prefix}:${name}` : name
  const space =
    options?.type === 'sessionStorage' ? sessionStorage : localStorage

  let debounced: number | null = null
  let timeout: ReturnType<typeof setTimeout> | null = null

  const storeEffect = (state: any) => {
    if (!mounted) return
    const debounceTime = untrack(() => options?.debounce)

    if (debounceTime) {
      const now = Date.now()
      debounced = now
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        write(state)
        debounced = null
      }, debounceTime)
      return
    }

    write(state)
  }

  const write = (state: any) => {
    untrack(() => options?.beforeWrite?.(store))

    const copy = { ...state }
    space.setItem(key, JSON.stringify(copy))

    untrack(() => options?.afterWrite?.(store))
  }

  const readStore = () => {
    untrack(() => options?.beforeRead?.(store))

    const stored = space.getItem(key)

    if (stored) {
      const state = JSON.parse(stored)
      for (const key in state) {
        if (store[key] !== state[key]) {
          const properties = Object.getOwnPropertyDescriptor(store, key)
          if (properties?.set) {
            store[key] = state[key]
          }
        }
      }
    }

    untrack(() => options?.afterRead?.(store))
  }

  onMount(() => {
    readStore()
    mounted = true
  })

  watch(
    () =>
      Object.keys(store).map(key => {
        store[key]
      }),
    () => storeEffect(store),
  )
}
