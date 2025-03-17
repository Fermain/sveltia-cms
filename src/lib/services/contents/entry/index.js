import { getDateTimeParts } from '@sveltia/utils/datetime';
import moment from 'moment';
import { get } from 'svelte/store';
import { backend } from '$lib/services/backends';
import { fillSlugTemplate } from '$lib/services/common/slug';
import { siteConfig } from '$lib/services/config';
import { getEntryFoldersByPath } from '$lib/services/contents';
import { getCollection } from '$lib/services/contents/collection';

/**
 * Get a list of collections the given entry belongs to. One entry can theoretically appear in
 * multiple collections depending on the configuration, so that the result is an array.
 * @param {import('$lib/typedefs').Entry} entry Entry.
 * @returns {import('$lib/typedefs').Collection[]} Collections.
 */
export const getAssociatedCollections = (entry) =>
  getEntryFoldersByPath(Object.values(entry.locales)[0].path)
    .map(({ collectionName }) => getCollection(collectionName))
    .filter((collection) => !!collection);

/**
 * Get the given entry file’s web-accessible URL on the live site.
 * @param {import('$lib/typedefs').Entry} entry Entry.
 * @param {import('$lib/typedefs').LocaleCode} locale Locale.
 * @param {import('$lib/typedefs').Collection} collection Collection.
 * @param {import('$lib/typedefs').CollectionFile} [collectionFile] Collection file. File
 * collection only.
 * @returns {string | undefined} URL on the live site.
 */
export const getEntryPreviewURL = (entry, locale, collection, collectionFile) => {
  const { show_preview_links: showLinks = true, _baseURL: baseURL } = get(siteConfig) ?? {};
  const { slug, path: entryFilePath, content } = entry.locales[locale] ?? {};

  const {
    preview_path: pathTemplate,
    preview_path_date_field: dateFieldName,
    fields,
  } = collectionFile ?? collection;

  if (!showLinks || !baseURL || !entryFilePath || !content || !pathTemplate) {
    return undefined;
  }

  /** @type {Record<string, string> | undefined} */
  let dateTimeParts;

  if (/{{(?:year|month|day|hour|minute|second)}}/g.test(pathTemplate)) {
    const fieldConfig = dateFieldName
      ? fields?.find(({ widget, name }) => widget === 'datetime' && name === dateFieldName)
      : fields?.find(({ widget }) => widget === 'datetime');

    const fieldValue = fieldConfig ? content[fieldConfig.name] : undefined;

    if (!fieldConfig || !fieldValue) {
      return undefined;
    }

    const { format, picker_utc: utc = false } =
      /** @type {import('$lib/typedefs').DateTimeField} */ (fieldConfig);

    dateTimeParts = getDateTimeParts({
      date: (utc ? moment.utc : moment)(fieldValue, format).toDate(),
      timeZone: utc ? 'UTC' : undefined,
    });
  }

  try {
    const path = fillSlugTemplate(pathTemplate, {
      type: 'preview_path',
      collection,
      content,
      locale,
      currentSlug: slug,
      entryFilePath,
      dateTimeParts,
    });

    return `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  } catch {
    return undefined;
  }
};

/**
 * Get the given entry file’s web-accessible URL on the repository.
 * @param {import('$lib/typedefs').Entry} entry Entry.
 * @param {import('$lib/typedefs').LocaleCode} locale Locale.
 * @returns {string} URL on the repository.
 */
export const getEntryRepoBlobURL = (entry, locale) =>
  `${get(backend)?.repository?.blobBaseURL}/${entry.locales[locale]?.path}?plain=1`;
