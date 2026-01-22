<script lang="ts">
import 'modern-normalize/modern-normalize.css'
import '../docs/assets/main.scss'

let { children } = $props()
</script>

<svelte:head>
  <title>sv-store</title>
</svelte:head>

<div id="root" class="color-red">
  <div class="navigation container">
    <div class="logo">
      <a href="/">sv-store</a>
    </div>

    <div class="links">
      <a href="https://github.com/alexampersandria/sv-store" target="_blank"
        >GitHub</a>
      <a href="https://npmjs.com/package/sv-store" target="_blank">npm</a>
    </div>
  </div>

  <div class="content container">
    {@render children()}
  </div>

  <div class="footer container">
    <div class="centered muted">
      Created by <a href="https://liara.io" target="_blank">
        Liara Alexandria Brüchmann
      </a>
    </div>
  </div>
</div>

<style lang="scss">
#root {
  .navigation {
    display: flex;
    justify-content: space-between;
    padding-block: 2rem;

    .links {
      display: flex;
      gap: 1rem;
    }
  }

  .content {
    flex: 1;
  }

  .footer {
    padding: 2rem 0 3rem 0;
  }
}
</style>
