import js from '@eslint/js';
import json from '@eslint/json';
import {defineConfig} from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const ignores = [
    'node_modules/**',
    '*.log',
    '.env',
    '*.env',
    '.idea/**',
    'package-lock.json'
];

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        ignores,
        plugins: {
            js,
            import: importPlugin,
        },
        extends: ['js/recommended'],
        languageOptions: {globals: globals.node},
        rules: {
            'no-console': 'off',                 // Allow console in backend scripts
            'no-unused-vars': ['warn', {argsIgnorePattern: '^_'}], // Warn on unused vars, ignore _prefix
            'prefer-const': 'error',             // Prefer const for variables that are never reassigned
            'curly': ['error', 'all'],           // Require braces for all control statements
            'no-var': 'error',                    // Disallow var, use let/const
            'consistent-return': 'error',        // Require consistent return statements
            'no-magic-numbers': ['warn', {ignore: [0, 1]}], // Warn on magic numbers, allow 0 and 1
            'object-shorthand': ['error', 'always'], // Enforce shorthand syntax for objects
            'array-callback-return': 'error',    // Enforce return in array methods
            'no-empty-function': 'warn',         // Warn on empty functions
            'no-duplicate-imports': 'error',      // Prevent duplicate imports
            'quotes': ['error', 'single', {'avoidEscape': true, 'allowTemplateLiterals': true}], // Enforce single quotes
            'semi': ['error', 'always'],

            // Import order rules
            'import/order': [
                'error',
                {
                    'groups': [
                        'builtin',    // nodejs modules
                        'external',   // npm packages
                        'internal',   // internal modules
                        ['parent', 'sibling', 'index'] // relative imports
                    ],
                    'newlines-between': 'always', // enforce spacing between groups
                    'alphabetize': {'order': 'asc', 'caseInsensitive': true} // sort alphabetically
                }
            ]
        },
    },
    {
        files: ['**/*.json'],
        ignores,
        plugins: {json},
        language: 'json/json',
        extends: ['json/recommended'],
    },
]);
