<script>
  import { Group } from '@sveltia/ui';
  import { _ } from 'svelte-i18n';
</script>

<Group class="release-page" aria-label={$_('release_information')}>
  <h1>{$_('release_title')}</h1>
  <div class="content">
    <p>{$_('release_placeholder')}</p>
  </div>
</Group>

<style lang="scss">
  .release-page {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;

    h1 {
      font-size: var(--sui-font-size-xxx-large);
      font-weight: var(--sui-font-weight-bold);
      margin-bottom: 24px;
    }

    .content {
      font-size: var(--sui-font-size-medium);
      line-height: 1.5;
    }
  }
</style>
