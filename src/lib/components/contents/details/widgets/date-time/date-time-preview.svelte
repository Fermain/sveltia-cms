<!--
  @component
  Implement the preview for the DataTime widget.
  @see https://decapcms.org/docs/widgets/#datetime
-->
<script>
  import { getCanonicalLocale } from '$lib/services/contents/i18n';
  import { getDate, parseDateTimeConfig } from '$lib/services/contents/widgets/date-time/helper';
  import { dateFormatOptions, timeFormatOptions } from '$lib/services/utils/date';

  /**
   * @import { WidgetPreviewProps } from '$lib/types/private';
   * @import { DateTimeField } from '$lib/types/public';
   */

  /**
   * @typedef {object} Props
   * @property {DateTimeField} fieldConfig Field configuration.
   * @property {string | undefined} currentValue Field value.
   */

  /** @type {WidgetPreviewProps & Props} */
  let {
    /* eslint-disable prefer-const */
    locale,
    fieldConfig,
    currentValue,
    /* eslint-enable prefer-const */
  } = $props();

  const { dateOnly, timeOnly, utc } = $derived(parseDateTimeConfig(fieldConfig));
  const date = $derived(getDate(currentValue, fieldConfig));
  const canonicalLocale = $derived(getCanonicalLocale(locale));

  const dateRegex = /^\d{4}-[01]\d-[0-3]\d$/;
  const timeSuffixRegex = /T00:00(?::00)?(?:\.000)?Z$/;
</script>

{#if date}
  <p lang={locale} dir="auto">
    {#if timeOnly}
      {date.toLocaleTimeString(canonicalLocale, timeFormatOptions)}
    {:else}
      <time datetime={date.toJSON()}>
        {#if dateOnly}
          {date.toLocaleDateString(canonicalLocale, {
            ...dateFormatOptions,
            timeZone:
              utc ||
              (dateOnly && !!currentValue?.match(dateRegex)) ||
              (dateOnly && !!currentValue?.match(timeSuffixRegex))
                ? 'UTC'
                : undefined,
          })}
        {:else}
          {date.toLocaleString(canonicalLocale, {
            ...dateFormatOptions,
            ...timeFormatOptions,
            timeZone: utc ? 'UTC' : undefined,
            timeZoneName: utc ? undefined : 'short',
          })}
        {/if}
      </time>
    {/if}
    {#if utc}
      UTC
    {/if}
  </p>
{/if}
