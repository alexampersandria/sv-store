<script>
import Hero from '../docs/components/Hero.svelte'
import Cards from '../docs/components/Cards.svelte'
import NextSteps from '../docs/components/NextSteps.svelte'
</script>

<div class="landing-page">
  <Hero />
  <Cards />
  <NextSteps />
</div>

<style lang="scss">
.landing-page {
  display: flex;
  flex-direction: column;
  gap: var(--padding-xl);
}
</style>
