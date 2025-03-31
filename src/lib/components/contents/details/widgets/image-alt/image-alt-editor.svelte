<!--
  @component
  Implement the editor for the Image Alt widget.
-->
<script>
  import { _ } from 'svelte-i18n';
  import ObjectEditor from '$lib/components/contents/details/widgets/object/object-editor.svelte';
  import { entryDraft } from '$lib/services/contents/draft';

  /**
   * @import { WidgetEditorProps } from '$lib/types/private';
   * @import { ObjectField } from '$lib/types/public';
   */

  /**
   * @typedef {object} Props
   * @property {ObjectField} fieldConfig Field configuration.
   * @property {object | undefined} currentValue Field value.
   */

  /** @type {WidgetEditorProps & Props} */
  let {
    /* eslint-disable prefer-const */
    locale,
    keyPath,
    fieldId,
    fieldLabel,
    fieldConfig,
    currentValue,
    required = true,
    /* eslint-enable prefer-const */
  } = $props();

  // Initialize the object value if it doesn't exist
  if (required && !currentValue) {
    currentValue = {};

    // Set the value in the entry draft
    if ($entryDraft?.currentValues[locale]) {
      $entryDraft.currentValues[locale][keyPath] = currentValue;
    }
  }

  // Create a modified field config that uses the object widget with predefined fields
  /** @type {ObjectField} */
  const modifiedFieldConfig = {
    ...fieldConfig,
    widget: 'object',
    required,
    fields: [
      {
        name: 'alt',
        label: $_('editor_components.alt'),
        widget: 'string',
        required,
      },
      {
        name: 'src',
        label: $_('editor_components.image'),
        widget: 'image',
        required,
      },
    ],
  };
</script>

<ObjectEditor
  {locale}
  {keyPath}
  {fieldId}
  {fieldLabel}
  fieldConfig={modifiedFieldConfig}
  {currentValue}
  {required}
/>
