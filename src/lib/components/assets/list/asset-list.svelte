<script>
  import { GridBody } from '@sveltia/ui';
  import { _ } from 'svelte-i18n';
  import AssetListItem from '$lib/components/assets/list/asset-list-item.svelte';
  import DropZone from '$lib/components/assets/shared/drop-zone.svelte';
  import UploadAssetsButton from '$lib/components/assets/toolbar/upload-assets-button.svelte';
  import EmptyState from '$lib/components/common/empty-state.svelte';
  import InfiniteScroll from '$lib/components/common/infinite-scroll.svelte';
  import ListContainer from '$lib/components/common/list-container.svelte';
  import ListingGrid from '$lib/components/common/listing-grid.svelte';
  import {
    canCreateAsset,
    globalAssetFolder,
    selectedAssetFolder,
    uploadingAssets,
  } from '$lib/services/assets';
  import { assetGroups, currentView, listedAssets } from '$lib/services/assets/view';

  /**
   * @import { Asset } from '$lib/types/private';
   */

  const viewType = $derived($currentView.type);
  const uploadDisabled = $derived(!canCreateAsset($selectedAssetFolder));
</script>

<ListContainer aria-label={$_('asset_list')}>
  <DropZone
    disabled={uploadDisabled}
    multiple={true}
    onSelect={({ files }) => {
      $uploadingAssets = {
        folder: $selectedAssetFolder?.internalPath || $globalAssetFolder?.internalPath,
        files,
      };
    }}
  >
    {#if Object.values($assetGroups).flat(1).length}
      <ListingGrid
        id="asset-list"
        {viewType}
        aria-label={$_('assets')}
        aria-rowcount={$listedAssets.length}
      >
        {#each Object.entries($assetGroups) as [name, assets] (name)}
          <GridBody label={name !== '*' ? name : undefined}>
            <InfiniteScroll items={assets} itemKey="path">
              {#snippet renderItem(/** @type {Asset} */ asset)}
                {#key asset.sha}
                  <AssetListItem {asset} {viewType} />
                {/key}
              {/snippet}
            </InfiniteScroll>
          </GridBody>
        {/each}
      </ListingGrid>
    {:else}
      <EmptyState>
        <span role="none">{$_('no_files_found')}</span>
        {#if !uploadDisabled}
          <UploadAssetsButton label={$_('upload_assets')} />
        {/if}
      </EmptyState>
    {/if}
  </DropZone>
</ListContainer>
