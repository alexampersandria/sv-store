<script lang="ts">
import { afterNavigate } from '$app/navigation'
import { page } from '$app/state'

let { open = $bindable(false) } = $props()

const nav = [
  {
    label: 'Docs',
    items: [
      { label: 'Introduction', href: '/' },
      { label: 'Getting Started', href: '/getting-started' },
      { label: 'API Reference', href: '/api' },
    ],
  },
  {
    label: 'Playground',
    items: [
      { label: 'Counter', href: '/counter' },
      { label: 'Callbacks', href: '/callback' },
    ],
  },
]

afterNavigate(() => {
  open = false
})
</script>

<nav class="menu" class:open>
  {#each nav as group}
    <div class="menu-section">
      <div class="title">{group.label}</div>
      {#each group.items as item}
        <a
          class="menu-item"
          class:active={page.url.pathname === item.href}
          href={item.href}>
          {item.label}
        </a>
      {/each}
    </div>
  {/each}
</nav>

<style lang="scss">
.menu {
  width: 11rem;
  flex-shrink: 0;

  position: sticky;
  top: calc(4rem + var(--padding-l));
  align-self: flex-start;

  display: flex;
  flex-direction: column;
  gap: var(--padding-l);

  a {
    text-decoration: none;
  }

  .menu-section {
    display: flex;
    flex-direction: column;
    gap: var(--padding-xs);

    .title {
      font-size: var(--font-size-xs);
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
    }

    .menu-item {
      font-size: var(--font-size-s);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      position: relative;

      transition:
        var(--interactive-transition),
        padding-left 0.25s;

      &:hover,
      &.active {
        color: var(--text-primary);
      }

      &:before {
        background-color: var(--border-color);
        position: absolute;
        left: 0;
        display: block;
        content: '';
        height: 1em;
        width: 2px;
        opacity: 0;
        transition: opacity 0.25s;
      }

      &.active {
        padding-left: var(--padding-s);

        &:before {
          opacity: 1;
        }
      }
    }
  }

  @media screen and (max-width: 860px) {
    position: fixed;
    width: 100vw;
    height: 200dvh;
    top: 0;
    left: 0;
    padding: var(--padding-m);
    padding-top: calc(4rem + var(--padding-m));
    z-index: 1;
    backdrop-filter: blur(12px);
    border-bottom: var(--border-width) solid var(--transparent-border);
    border-top: var(--border-width) solid var(--border-color);

    transition:
      opacity 0.25s,
      backdrop-filter 0.25s,
      transform 0.25s;

    &:before {
      display: block;
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--background-primary);
      opacity: 0.75;
      z-index: -1;
    }

    &:not(.open) {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-12px);
    }

    .menu-section {
      .title {
        font-size: var(--font-size-s);
      }

      .menu-item {
        font-size: var(--font-size-m);
      }
    }
  }
}
</style>
