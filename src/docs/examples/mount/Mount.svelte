<script lang="ts">
import { onMount } from 'svelte'
import { useMountStore } from './mount.svelte.ts'

let mountStore = useMountStore()

let mountedValue = $state()
let timeoutValue = $state()
onMount(() => {
  console.log('🐶 onMount Mount')
  mountedValue = mountStore.value
  setTimeout(() => {
    console.log('🐶 setTimeout Mount')
    timeoutValue = mountStore.value
  })
})
</script>

<div class="counter">
  <div class="value">
    <b>value:</b>
    {mountStore.value}
  </div>
  <div class="mount-value">
    <b>mount value:</b>
    {mountedValue}
  </div>
  <div class="timeout-value">
    <b>timeout value:</b>
    {timeoutValue}
  </div>
  <input bind:value={mountStore.value} />
</div>
