<script lang="ts">
import { ArrowRight, Check } from 'lucide-svelte'
import Button from './Button.svelte'

const packageManagers = ['bun', 'pnpm', 'yarn', 'npm']
let selectedPackageManager = $state(packageManagers[0])

let {
  version,
}: {
  version?: string
} = $props()

const installCommand = $derived.by(() => {
  switch (selectedPackageManager) {
    case 'bun':
      return 'bun add -D sv-store'
    case 'pnpm':
      return 'pnpm add -D sv-store'
    case 'yarn':
      return 'yarn add -D sv-store'
    case 'npm':
      return 'npm install --save-dev sv-store'
    default:
      return 'bun add -D sv-store'
  }
})

let copied = $state(false)

async function copyCommand() {
  await navigator.clipboard.writeText(installCommand)
  copied = true
  setTimeout(() => (copied = false), 2000)
}
</script>

<div class="hero">
  <div class="text">
    <div class="hero-title">
      <h1>sv-store</h1>
      {#if version}
        <div class="version">
          {version}
        </div>
      {/if}
    </div>
    <div class="muted hero-tagline">
      Persistent reactive stores for Svelte 5 & SvelteKit
    </div>
  </div>

  <div class="install">
    <div class="package-managers">
      {#each packageManagers as packageManager (packageManager)}
        <button
          class="package-manager-option"
          class:selected={selectedPackageManager === packageManager}
          onclick={() => (selectedPackageManager = packageManager)}>
          {packageManager}
        </button>
      {/each}
    </div>
    <div class="command-row">
      <code class="command">{installCommand}</code>
      <Button onclick={copyCommand} aria-label="Copy install command">
        {#if copied}
          <Check /> Copied
        {:else}
          Copy
        {/if}
      </Button>
    </div>
  </div>

  <div class="cta">
    <Button href="/getting-started" type="primary">
      Get Started
      <ArrowRight />
    </Button>
    <Button href="/api">API Reference</Button>
  </div>
</div>

<style lang="scss">
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--padding-l);

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--padding-s);

    .hero-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--padding-m);

      h1 {
        margin: 0;
      }

      .version {
        background-color: var(--background-secondary);
        padding: var(--padding-xs) var(--padding-m);
        border-radius: 9999px;
        border: var(--border-width) solid var(--border-color);
        font-size: var(--font-size-s);
        color: var(--text-muted);
      }
    }

    .hero-tagline {
      font-size: var(--font-size-l);
    }
  }

  .install {
    display: flex;
    flex-direction: column;
    border: var(--border-width) solid var(--border-color);
    background-color: var(--border-color);
    gap: 1px;
    border-radius: var(--radius-m);
    overflow: hidden;

    .package-managers {
      display: flex;
      background-color: var(--border-color);
      gap: 1px;

      .package-manager-option {
        border-radius: 0;
        border: 0;
        flex-grow: 1;
        transform: none;
        background-color: var(--background-secondary);

        &.selected {
          background-color: var(--background-accent);
        }
      }
    }

    .command-row {
      display: flex;
      align-items: center;
      background-color: var(--background-secondary);
      padding: var(--padding-s);

      .command {
        flex: 1;
        color: var(--text-muted);
        font-family: 'Fira Code', monospace;
        font-size: var(--font-size-s);
        padding: 0 var(--padding-s);
      }
    }
  }

  .cta {
    display: flex;
    gap: var(--padding-s);
  }
}
</style>
