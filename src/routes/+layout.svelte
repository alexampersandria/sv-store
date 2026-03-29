<script lang="ts">
import 'modern-normalize/modern-normalize.css'
import '../docs/assets/main.scss'
import { afterNavigate } from '$app/navigation'
import Footer from '../docs/components/Footer.svelte'
import Header from '../docs/components/Header.svelte'
import Menu from '../docs/components/Menu.svelte'
import { registerStore } from '$lib'
import { useDocsStore } from '../docs/stores/docsStore.svelte'

let { children } = $props()

const docsStore = useDocsStore()
registerStore('docs', docsStore)

afterNavigate(() => {
  document.getElementById('root')?.scrollTo({ top: 0 })
})

let menuOpen = $state(false)
</script>

<svelte:head>
  <title>sv-store</title>
</svelte:head>

<div id="root" class={`theme-${docsStore.theme}`}>
  <Header onopenmenu={() => (menuOpen = !menuOpen)} />

  <div class="container page-layout">
    <Menu bind:open={menuOpen} />
    <main>
      {@render children()}
    </main>
  </div>

  <Footer />
</div>

<style lang="scss">
#root {
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  color: var(--text-primary);
  min-height: 100vh;

  .page-layout {
    display: flex;
    flex: 1;
    width: 100%;
    gap: var(--padding-xl);
    padding-block: var(--padding-l);

    main {
      flex-grow: 1;
      width: 100%;
    }
  }
}
</style>
