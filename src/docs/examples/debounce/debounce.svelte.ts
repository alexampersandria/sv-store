export type DebounceState = {
  value?: string
}

let value: DebounceState['value'] = $state()

export const useDebounceStore: () => DebounceState = () => {
  return {
    get value() {
      return value
    },
    set value(to) {
      value = to
    },
  }
}
