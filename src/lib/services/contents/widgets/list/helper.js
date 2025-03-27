import { escapeRegExp } from '@sveltia/utils/string';
import { getFieldConfig, getFieldDisplayValue } from '$lib/services/contents/entry/fields';

/**
 * @import { FlattenedEntryContent, InternalLocaleCode } from '$lib/types/private';
 * @import { Field, FieldKeyPath, ListField } from '$lib/types/public';
 */

/**
 * Check if the given fields contain a single List widget with the `root` option enabled.
 * @param {Field[]} fields Field list.
 * @returns {boolean} Result.
 */
export const hasRootListField = (fields) =>
  fields.length === 1 &&
  fields[0].widget === 'list' &&
  /** @type {ListField} */ (fields[0]).root === true;

/**
 * Format the summary template of a List field.
 * @param {object} args Arguments.
 * @param {string} args.collectionName Collection name.
 * @param {string} [args.fileName] File name.
 * @param {FieldKeyPath} args.keyPath Field key path.
 * @param {FlattenedEntryContent} args.valueMap Entry content.
 * @param {InternalLocaleCode} args.locale Locale code.
 * @param {string} [args.summaryTemplate] Summary template, e.g. `{{fields.slug}}`.
 * @param {boolean} args.hasSingleSubField Whether the field has a single `field` instead of
 * multiple `fields`.
 * @param {number} args.index List index.
 * @returns {string} Formatted summary.
 */
export const formatSummary = ({
  collectionName,
  fileName,
  keyPath,
  valueMap,
  locale,
  summaryTemplate,
  hasSingleSubField,
  index,
}) => {
  const getFieldConfigArgs = { collectionName, fileName, valueMap };

  if (!summaryTemplate) {
    if (hasSingleSubField) {
      return valueMap[`${keyPath}.${index}`];
    }

    const prefixRegex = new RegExp(`^${escapeRegExp(keyPath)}\\.${index}[\\b\\.]`);

    const item = Object.fromEntries(
      Object.entries(valueMap)
        .filter(([key]) => prefixRegex.test(key))
        .map(([key, value]) => [key.replace(prefixRegex, ''), value]),
    );

    return (
      item.title ||
      item.name ||
      // Use the first visible string-type field value, if available
      Object.entries(valueMap).find(
        ([key, value]) =>
          prefixRegex.test(key) &&
          typeof value === 'string' &&
          !!value.trim() &&
          getFieldConfig({ ...getFieldConfigArgs, keyPath: key })?.widget !== 'hidden',
      )?.[1] ||
      ''
    );
  }

  return summaryTemplate.replaceAll(/{{(.+?)}}/g, (_match, /** @type {string} */ placeholder) => {
    const [tag, ...transformations] = placeholder.split(/\s*\|\s*/);
    const _keyPath = `${keyPath}.${index}.${tag.replace(/^fields\./, '')}`;

    if (hasSingleSubField) {
      // Check if the key path is valid
      if (!getFieldConfig({ ...getFieldConfigArgs, keyPath: _keyPath })) {
        return '';
      }
    }

    return getFieldDisplayValue({
      ...getFieldConfigArgs,
      keyPath: hasSingleSubField ? `${keyPath}.${index}` : _keyPath,
      locale,
      transformations,
    });
  });
};
