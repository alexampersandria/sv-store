<script lang="ts">
import { register } from '$lib/register.svelte'
import { useCounterStore } from './counter.svelte.ts'

register('counter', useCounterStore())
let counterStore = useCounterStore()
</script>

<div class="counter">
  <div class="properties">
    {#each Object.entries(counterStore) as [key, value]}
      {#if typeof value !== 'function'}
        <div class="property">
          <div class="key bold">
            {key}
          </div>
          <div class="value">
            {value}
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <div class="actions">
    <button onclick={counterStore.decrement}>-</button>
    <input type="number" bind:value={counterStore.value} />
    <button onclick={counterStore.increment}>+</button>
  </div>
</div>

<style lang="scss">
.counter {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .properties {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .property {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
    }

    input,
    button {
      padding: 0.5rem 1rem;
    }
  }
}
</style>
