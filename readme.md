# sv-store

A Svelte library for creating and managing persistent stores using localStorage or sessionStorage

## Getting Started

First define your store

```ts
export type ExampleModel = {
  value?: string
}

let value: ExampleModel['value'] = $state()

export const useExampleStore: () => ExampleModel = () => {
  return {
    get value() {
      return value
    },
    set value(to) {
      value = to
    },
  }
}
```

Then register it once in your main file or root layout file

```ts
import { registerStore } from 'sv-store'
import { useExampleStore } from './exampleStore.svelte.ts'

// will be saved to local storage as `sv-store:example`
registerStore('example', useExampleStore())
```

The store can also be saved in session storage or use a different prefix

```ts
registerStore('example', useExampleStore(), {
  prefix: 'store', // or set prefix to `null` for no prefix at all
  type: 'sessionStorage',
})
```

And use it throughtout your app and components

```ts
import { useExampleStore } from './exampleStore.svelte.ts'

let exampleStore = useExampleStore()
```
