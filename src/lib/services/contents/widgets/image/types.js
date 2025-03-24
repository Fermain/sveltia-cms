/**
 * @typedef {object} ImageWidgetConfig
 * @property {string} name Field name.
 * @property {string} label Field label.
 * @property {boolean} [required] Whether the field is required.
 * @property {string} [hint] Field description.
 * @property {[string, string]} [pattern] Pattern for file path.
 * @property {string} [folder] Media folder path.
 * @property {string} [media_folder] Media folder path.
 * @property {string} [public_folder] Public folder path.
 * @property {number} [max_file_size] Maximum file size in bytes.
 * @property {string[]} [allowed_formats] Allowed file formats.
 * @property {object} [media_library] Media library configuration.
 * @property {object} [media_library.config] Media library specific configuration.
 */

/**
 * @typedef {object} ImageWidgetValue
 * @property {string} path File path.
 * @property {string} alt Alt text.
 * @property {object} [metadata] Image metadata.
 */

/**
 * @typedef {object} ImageValidationResult
 * @property {boolean} isValid Whether the file is valid.
 * @property {string[]} errors List of validation errors.
 */

/**
 * @typedef {ImageWidgetConfig & {
 *   value?: ImageWidgetValue;
 *   currentValue?: string;
 *   disabled?: boolean;
 *   readonly?: boolean;
 *   error?: string;
 *   locale?: string;
 *   keyPath?: string[];
 * }} ImageWidgetProps
 */

export {};
