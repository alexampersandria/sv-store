export type MountState = {
  value: number
}

let value: MountState['value'] = $state(0)

export const useMountStore: () => MountState = () => {
  return {
    get value() {
      return value
    },
    set value(to) {
      value = to
    },
  }
}
