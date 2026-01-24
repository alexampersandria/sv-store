export type CounterState = {
  value: number
  doubleValue: number
  increment: () => void
  decrement: () => void
}

let value: CounterState['value'] = $state(0)
const doubleValue: number = $derived.by(() => {
  return value * 2
})

const increment = () => {
  value += 1
}

const decrement = () => {
  value -= 1
}

export const useCounterStore: () => CounterState = () => {
  return {
    get value() {
      return value
    },
    set value(to) {
      value = to
    },

    get doubleValue() {
      return doubleValue
    },

    get increment() {
      return increment
    },
    get decrement() {
      return decrement
    },
  }
}
