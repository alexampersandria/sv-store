<script lang="ts">
import { ArrowRight, Check } from 'lucide-svelte'

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
      <h1>🌱 sv-store</h1>
      {#if version}
        <div class="version">
          {version}
        </div>
      {/if}
    </div>
    <div class="muted hero-tagline">
      Persistent reactive stores for Svelte 5 & SvelteKit <br />
      Don't think about storage, just build your app
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
      <button
        class="copy-btn icon"
        onclick={copyCommand}
        aria-label="Copy install command">
        {#if copied}
          <Check /> Copied
        {:else}
          Copy
        {/if}
      </button>
    </div>
  </div>

  <div class="cta-links">
    <a href="/getting-started" class="cta-primary icon">
      Get Started
      <ArrowRight />
    </a>
    <a href="/api" class="cta-secondary"> API Reference </a>
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

      .copy-btn {
        flex-shrink: 0;
        color: var(--text-muted);

        &:hover {
          color: var(--text-primary);
          background-color: var(--border-color);
        }
      }
    }
  }

  .cta-links {
    display: flex;
    gap: var(--padding-s);
    flex-wrap: wrap;

    a {
      display: inline-flex;
      align-items: center;
      padding: var(--padding-xs) var(--padding-m);
      border-radius: var(--radius-s);
      font-size: var(--font-size-s);
      font-weight: 500;
      text-decoration: none;

      &.cta-primary {
        background-color: var(--text-primary);
        color: var(--background-primary);

        &:hover {
          opacity: 0.85;
          color: var(--background-primary);
        }
      }

      &.cta-secondary {
        background-color: transparent;
        border: var(--border-width) solid var(--border-color);
        color: var(--text-muted);

        &:hover {
          color: var(--text-primary);
          border-color: var(--text-dimmed);
        }
      }
    }
  }
}
</style>
