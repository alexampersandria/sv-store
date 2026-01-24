<script lang="ts">
import { useCallbackStore, type CallbackState } from './callback.svelte.ts'
import { registerStore } from '$lib/registerStore.svelte'

let logState = $state<
  Array<{
    timestamp: Date
    event: string
    value?: CallbackState['value']
  }>
>([])
const log = (event: string, state: CallbackState) => {
  logState.push({
    timestamp: new Date(),
    event,
    value: state.value,
  })
}

registerStore('callback', useCallbackStore(), {
  beforeRead: value => log('beforeRead', value),
  afterRead: value => log('afterRead', value),
  beforeWrite: value => log('beforeWrite', value),
  afterWrite: value => log('afterWrite', value),
})
let callbackStore = useCallbackStore()
</script>

<div class="callback-store">
  <div class="state-value">
    <input type="text" bind:value={callbackStore.value} />
  </div>

  <div class="log mono">
    {#each logState as entry}
      <div class="entry">
        <div class="timestamp">
          {entry.timestamp.toLocaleTimeString() +
            `.${entry.timestamp.getMilliseconds()}`}
        </div>
        <div class="event" data-event={entry.event}>
          {entry.event}
        </div>
        <div class="value" data-undefined={!entry.value}>
          {entry.value || 'undefined'}
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
.callback-store {
  display: flex;
  flex-direction: column;
  gap: var(--padding-m);

  .state-value {
    input {
      padding: var(--padding-m);
      width: 100%;
    }
  }

  .log {
    height: calc(12lh + var(--padding-m) * 2);
    overflow: auto;
    border: var(--border-width) solid var(--border-color);
    padding: var(--padding-m);
    background-color: var(--background-secondary);
    border-radius: var(--radius-s);

    .entry {
      display: flex;
      gap: var(--padding-m);

      .timestamp {
        width: 12ch;
        flex-shrink: 0;

        color: var(--text-muted);
      }

      .event {
        width: 11ch;
        flex-shrink: 0;

        &[data-event='beforeRead'] {
          color: var(--color-blue-60);
        }
        &[data-event='afterRead'] {
          color: var(--color-green-60);
        }
        &[data-event='beforeWrite'] {
          color: var(--color-purple-60);
        }
        &[data-event='afterWrite'] {
          color: var(--color-red-60);
        }
      }

      .value {
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;

        &[data-undefined='true'] {
          color: var(--text-dimmed);
        }
      }
    }
  }
}
</style>
