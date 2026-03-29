export type CounterState = {
  value: number
  doubleValue: number
  isEven: boolean
  increment: () => void
  decrement: () => void
}

let value: CounterState['value'] = $state(0)
const doubleValue = $derived(value * 2)
const isEven: boolean = $derived.by(() => {
  return value % 2 === 0
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
    get isEven() {
      return isEven
    },

    get increment() {
      return increment
    },
    get decrement() {
      return decrement
    },
  }
}
