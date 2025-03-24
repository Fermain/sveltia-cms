<!-- @import { ImageWidgetProps } from './types.js'; -->

<!--
  @component
  Image widget implementation that uses the file widget editor with image-specific configuration.
-->
<script>
  import FileEditor from '../file/file-editor.svelte';

  /** @type {import('./types.js').ImageWidgetProps} */
  export let props;

  /** @type {import('$lib/types/public').ImageField} */
  $: fieldConfig = {
    ...props,
    widget: 'image',
    pattern: props.pattern ? /** @type {[string, string]} */ (props.pattern) : undefined,
    media_library: {
      config: {
        max_file_size: props.max_file_size,
      },
    },
  };

  /** @type {string} */
  $: currentValue =
    props.value && typeof props.value === 'object' && 'path' in props.value
      ? String(props.value.path)
      : '';
</script>

<FileEditor
  {...props}
  {fieldConfig}
  fieldId={props.name}
  fieldLabel={props.label}
  locale=""
  keyPath=""
  {currentValue}
/>
