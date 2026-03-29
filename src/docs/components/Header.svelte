<script lang="ts">
import { Menu } from 'lucide-svelte'
import ThemeToggle from './ThemeToggle.svelte'

let {
  onopenmenu,
}: {
  onopenmenu: () => void
} = $props()
</script>

<header class="header">
  <div class="container header-inner">
    <button class="open-menu plain" onclick={onopenmenu}>
      <Menu />
    </button>
    <a class="logo" href="/">sv-store</a>
    <div class="links">
      <a href="https://github.com/alexampersandria/sv-store" target="_blank">
        GitHub
      </a>
      <a href="https://npmjs.com/package/sv-store" target="_blank"> npm </a>
      <ThemeToggle />
    </div>
  </div>
</header>

<style lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: var(--border-width) solid var(--transparent-border);
  backdrop-filter: blur(6px);

  a {
    text-decoration: none;
  }

  &:before {
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--background-primary);
    opacity: 0.5;
    z-index: -1;
  }

  .header-inner {
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .open-menu {
      padding: var(--padding-s);
      background-color: transparent !important;
    }

    .logo {
      font-weight: 800;
      font-size: var(--font-size-l);
    }

    .links {
      display: flex;
      gap: var(--padding-m);
      font-size: var(--font-size-s);
      align-items: center;
    }
  }

  @media screen and (max-width: 860px) {
    .logo {
      display: none;
    }

    .header-inner {
      .links {
        font-size: var(--font-size-m);
      }
    }
  }

  @media screen and (min-width: 861px) {
    .open-menu {
      display: none;
    }
  }
}
</style>
