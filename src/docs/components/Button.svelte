<script lang="ts">
import type { Snippet } from 'svelte'

// https://github.com/alexampersandria/diary.computer/blob/main/frontend/src/lib/components/Button.svelte
type ButtonType = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: Snippet
  type?: ButtonType
  disabled?: boolean
  fullwidth?: boolean
  onclick?: () => void
  href?: string
  target?: string
  'aria-label'?: string
  left?: boolean
  right?: boolean
}

let {
  children,
  type = 'secondary',
  disabled,
  fullwidth = false,
  onclick,
  href,
  target,
  'aria-label': ariaLabel,
  left,
  right,
}: ButtonProps = $props()

let clickHandler = () => {
  if (!disabled && onclick && !href) {
    onclick()
  }
}
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  class="button {type}"
  class:disabled
  class:fullwidth
  class:left
  class:right
  {disabled}
  aria-label={ariaLabel}
  role={href ? 'link' : 'button'}
  onclick={clickHandler}
  {href}
  {target}>
  <div class="button-content">
    {@render children()}
  </div>
</svelte:element>

<style lang="scss">
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: var(--button-height);
  border-radius: var(--button-radius);
  color: var(--button-color);
  border: var(--border-width) solid var(--button-border);
  background-color: var(--button-background);
  font-size: var(--button-size);
  line-height: 2; // ensure consistent line height depending on element type and no overflow from text
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none;
  user-select: none;

  .button-content {
    padding: var(--button-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--button-content-gap);
    overflow: hidden;
  }

  &.fullwidth {
    width: 100%;
  }

  &.left {
    justify-content: flex-start;

    .button-content {
      justify-content: flex-start;
    }
  }

  &.right {
    justify-content: flex-end;

    .button-content {
      justify-content: flex-end;
    }
  }

  :global(.lucide-icon) {
    font-size: var(--font-size-m);
    width: 1em;
    height: 1em;
    flex-shrink: 0;
  }

  .button-spinner {
    --spinner-size: 1rem;
    position: absolute;
  }

  &.loading {
    .button-content {
      opacity: 0;
    }
    .button-spinner {
      opacity: 1;
    }
  }

  &:not(:disabled, .loading) {
    cursor: pointer;

    &:hover {
      color: var(--button-color-hover);
      background-color: var(--button-background-hover);
      border-color: var(--button-border-hover);
    }

    &:active {
      color: var(--button-color-active);
      background-color: var(--button-background-active);
      border-color: var(--button-border-active);
      transform: var(--click-transform);
    }
  }

  &.primary {
    color: var(--button-primary-color);
    --spinner-color: var(--button-primary-color);
    border-color: var(--button-primary-border);
    background-color: var(--button-primary-background);

    &:not(:disabled, .loading) {
      &:hover {
        color: var(--button-primary-color-hover);
        background-color: var(--button-primary-background-hover);
        border-color: var(--button-primary-border-hover);
      }

      &:active {
        color: var(--button-primary-color-active);
        background-color: var(--button-primary-background-active);
        border-color: var(--button-primary-border-active);
      }
    }
  }

  &.ghost {
    background-color: transparent;
    border-color: transparent;

    &:not(:disabled, .loading) {
      &:hover {
        background-color: var(--button-background-hover);
        border-color: transparent;
      }

      &:active {
        background-color: var(--button-background-active);
        border-color: transparent;
      }
    }

    &:disabled {
      background-color: transparent !important;
      border-color: transparent !important;
    }
  }

  &:disabled {
    color: var(--input-disabled-color) !important;
    background-color: var(--input-disabled-background) !important;
    border-color: var(--input-disabled-border) !important;
  }
}
</style>
