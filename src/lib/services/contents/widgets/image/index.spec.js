import { describe, expect, it } from 'vitest';
import { getDefaultValue, transformValue, validateImage } from './index';

describe('Image Widget Service', () => {
  describe('validateImage', () => {
    it('should validate allowed image formats', async () => {
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

      const config = {
        name: 'test',
        label: 'Test Image',
      };

      const validResult = await validateImage(validFile, config);

      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = await validateImage(invalidFile, config);

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('File type not allowed');
    });

    it('should respect custom allowed formats', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' });

      const config = {
        name: 'test',
        label: 'Test Image',
        allowed_formats: ['jpg', 'jpeg'],
      };

      const result = await validateImage(file, config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File type not allowed');
    });

    it('should validate file size limits', async () => {
      const file = new File(['x'.repeat(1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });

      const config = {
        name: 'test',
        label: 'Test Image',
        max_file_size: 512 * 1024, // 512KB
      };

      const result = await validateImage(file, config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File size exceeds maximum allowed size');
    });
  });

  describe('getDefaultValue', () => {
    it('should return default value structure', () => {
      const defaultValue = getDefaultValue();

      expect(defaultValue).toEqual({
        path: '',
        alt: '',
        metadata: {},
      });
    });
  });

  describe('transformValue', () => {
    it('should handle null/undefined values', () => {
      const result = transformValue(null);

      expect(result).toEqual({
        path: '',
        alt: '',
        metadata: {},
      });
    });

    it('should transform valid values', () => {
      const value = {
        path: '/images/test.jpg',
        alt: 'Test image',
        metadata: {
          width: 800,
          height: 600,
        },
      };

      const result = transformValue(value);

      expect(result).toEqual({
        path: '/images/test.jpg',
        alt: 'Test image',
        metadata: {
          width: 800,
          height: 600,
        },
      });
    });

    it('should handle partial values', () => {
      /** @type {import('./types.js').ImageWidgetValue} */
      const value = {
        path: '/images/test.jpg',
        alt: '',
      };

      const result = transformValue(value);

      expect(result).toEqual({
        path: '/images/test.jpg',
        alt: '',
        metadata: {},
      });
    });
  });
});
