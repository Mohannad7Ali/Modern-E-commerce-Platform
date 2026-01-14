import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    // تجاهل ملفات الإعدادات من فحص النوع (Type-aware linting)
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.js', 'prisma.config.ts', '*.config.js', 'src/generated/**']
  },
  // 1. إعدادات ملفات الجافاسكريبت والتايب سكريبت
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    // دمج الإعدادات الموصى بها من تايسكربت يدوياً لضمان التوافق
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      js,
      prettier: prettierPlugin
    },
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: true
      }
    },
    rules: {
      // تفعيل قواعد تايسكربت الموصى بها
      ...tseslint.configs.recommended.rules,

      // إعدادات بريتيير والتحذيرات
      'prettier/prettier': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },

  // 2. إعدادات ملفات JSON
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error'
      // يمكنك إضافة قواعد JSON إضافية هنا
    }
  },

  // 3. إعدادات ملفات CSS
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    rules: {
      'css/no-duplicated-properties': 'error'
    }
  },

  // 4. تعطيل القواعد المتعارضة (يجب أن يكون في كائن مستقل في النهاية)
  prettierConfig
]);
