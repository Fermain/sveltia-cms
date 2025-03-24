/**
 * @import { ImageWidgetConfig, ImageValidationResult, ImageWidgetValue } from './types.js';
 */

/**
 * Default allowed image formats.
 * @type {string[]}
 */
const DEFAULT_ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'ico'];

/**
 * Validate an image file based on the widget configuration.
 * @param {File} file The file to validate.
 * @param {ImageWidgetConfig} config Widget configuration.
 * @returns {Promise<ImageValidationResult>} Validation result.
 */
export const validateImage = async (file, config) => {
  /** @type {string[]} */
  const errors = [];

  /** @type {ImageValidationResult} */
  const result = {
    isValid: true,
    errors: [],
  };

  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedFormats = config.allowed_formats || DEFAULT_ALLOWED_FORMATS;

  if (!allowedFormats.includes(extension)) {
    errors.push('File type not allowed');
    result.isValid = false;
  }

  // Check file size if configured
  if (config.max_file_size && file.size > config.max_file_size) {
    errors.push('File size exceeds maximum allowed size');
    result.isValid = false;
  }

  // TODO: Add image dimension validation once we have image processing capabilities
  // This would require loading the image and checking its dimensions

  result.errors = errors;
  return result;
};

/**
 * Get the default value for the image widget.
 * @returns {ImageWidgetValue} Default value.
 */
export const getDefaultValue = () => ({
  path: '',
  alt: '',
  metadata: {},
});

/**
 * Transform a value for the image widget.
 * @param {ImageWidgetValue | null | undefined} value The value to transform.
 * @returns {ImageWidgetValue} Transformed value.
 */
export const transformValue = (value) => {
  if (!value) {
    return getDefaultValue();
  }

  return {
    path: value.path || '',
    alt: value.alt || '',
    metadata: value.metadata || {},
  };
};
