export type CallbackState = {
  value?: string
}

let value: CallbackState['value'] = $state()

export const useCallbackStore: () => CallbackState = () => {
  return {
    get value() {
      return value
    },
    set value(to) {
      value = to
    },
  }
}
