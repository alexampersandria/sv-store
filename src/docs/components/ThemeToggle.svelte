<script lang="ts">
import { Moon, Sun } from 'lucide-svelte'
import { useDocsStore } from '../stores/docsStore.svelte'

const docsStore = useDocsStore()

const changeTheme = () => {
  if (docsStore.theme === 'dark') docsStore.theme = 'light'
  else docsStore.theme = 'dark'
}
</script>

<button class="theme-toggle plain" onclick={changeTheme}>
  {#if docsStore.theme === 'dark'}
    <Moon />
  {:else}
    <Sun />
  {/if}
</button>

<style lang="scss">
.theme-toggle {
  background-color: transparent !important;
  padding: var(--padding-s);
}
</style>
