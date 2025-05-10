<!--
  @component
  Implement the preview for the Image Alt widget.
-->
<script>
  import { _ } from 'svelte-i18n';
  import ObjectPreview from '$lib/components/contents/details/widgets/object/object-preview.svelte';

  /**
   * @import { WidgetPreviewProps } from '$lib/types/private';
   * @import { ObjectField } from '$lib/types/public';
   */

  /**
   * @typedef {object} Props
   * @property {ObjectField} fieldConfig Field configuration.
   * @property {object | undefined} currentValue Field value.
   */

  /** @type {WidgetPreviewProps & Props} */
  let {
    /* eslint-disable prefer-const */
    locale,
    keyPath,
    fieldConfig,
    currentValue,
    /* eslint-enable prefer-const */
  } = $props();

  // Create a modified field config that uses the object widget with predefined fields
  /** @type {ObjectField} */
  const modifiedFieldConfig = {
    ...fieldConfig,
    widget: 'object',
    fields: [
      {
        name: 'alt',
        label: $_('editor_components.alt'),
        widget: 'string',
        required: true,
      },
      {
        name: 'src',
        label: $_('editor_components.image'),
        widget: 'image',
        required: true,
      },
    ],
  };
</script>

<ObjectPreview {locale} {keyPath} fieldConfig={modifiedFieldConfig} {currentValue} />
