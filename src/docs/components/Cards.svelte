<div class="cards">
  <div class="card">
    <div class="title">Type safe</div>
    <div class="text">
      Fully typed with generics so your store value is always the right shape
    </div>
  </div>
  <div class="card">
    <div class="title">Lightweight</div>
    <div class="text">No dependencies, minimal bundle impact</div>
  </div>
  <div class="card">
    <div class="title">Simple API</div>
    <div class="text">
      One function to create a store, read and write it like any plain variable
    </div>
  </div>
  <div class="card">
    <div class="title">Cross-tab sync</div>
    <div class="text">Changes in one tab reflect immediately in all others</div>
  </div>
  <div class="card">
    <div class="title">Callback support</div>
    <div class="text">
      Subscribe to value changes and react whenever the store is updated
    </div>
  </div>
  <div class="card">
    <div class="title">Serialization</div>
    <div class="text">
      Bring your own serializer/deserializer for precise control
    </div>
  </div>
</div>

<style lang="scss">
.cards {
  display: flex;
  gap: var(--padding-m);
  flex-wrap: wrap;

  .card {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--padding-xxs);
    border-radius: var(--radius-m);
    padding: var(--padding-m);
    background-color: var(--background-secondary);
    border: var(--border-width) solid var(--border-color);

    .title {
      font-weight: 600;
      font-size: var(--font-size-l);
    }

    .text {
      color: var(--text-muted);
    }

    @media screen and (min-width: 861px) {
      width: calc(50% - var(--padding-m) / 2);
    }
  }
}
</style>
