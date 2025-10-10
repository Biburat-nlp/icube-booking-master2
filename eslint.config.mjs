import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
    {
        files: ['vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.eslint.json', './tsconfig.node.json']
            }
        },
        ignores: ["config/*"],
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
                parserOptions: {
                    project: './tsconfig.eslint.json'
                }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            import: importPlugin,
            prettier: prettierPlugin,
            'unused-imports': unusedImportsPlugin,
            'react-hooks': reactHooksPlugin,
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                    alwaysTryTypes: true
                }
            }
        },
        rules: {
            // Основные правила
            'no-console': ['warn', { allow: ['error'] }],
            'no-unreachable': 'warn',

            // TypeScript
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',

            // React
            'react/jsx-key': 'error',
            'react/jsx-curly-brace-presence': [
                'warn',
                {
                    props: 'never',
                    children: 'never',
                    propElementValues: 'always'
                }
            ],

            // Импорты
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type'
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    },
                    pathGroups: [
                        {
                            pattern: '@/app/**',
                            group: 'internal',
                            position: 'before'
                        },
                        {
                            pattern: '@/processes/**',
                            group: 'internal',
                            position: 'before'
                        },
                        {
                            pattern: '@/pages/**',
                            group: 'internal',
                            position: 'before'
                        },
                        {
                            pattern: '@/features/**',
                            group: 'internal',
                            position: 'before'
                        },
                        {
                            pattern: '@/entities/**',
                            group: 'internal',
                            position: 'before'
                        },
                        {
                            pattern: '@/shared/**',
                            group: 'internal',
                            position: 'before'
                        },
                        {
                            pattern: './*.module.scss',
                            group: 'index',
                            position: 'after'
                        }
                    ],
                    pathGroupsExcludedImportTypes: ['builtin']
                }
            ],
            'import/no-relative-packages': 'error',
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: true,
                    includeInternal: true,
                    includeTypes: true,
                }
            ],

            // FSD restrictions
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../*', '../../*', '../../../*'],
                            message: 'Use absolute imports with FSD aliases (@/...) instead.'
                        }
                    ]
                }
            ],

            // Prettier
            'prettier/prettier': [
                'warn',
                {
                    singleQuote: false,
                    semi: true,
                    printWidth: 120,
                    tabWidth: 4,
                    quoteProps: 'as-needed',
                    proseWrap: 'always',
                    trailingComma: 'es5',
                    useTabs: false,
                    jsxSingleQuote: false,
                    endOfLine: 'lf',
                    bracketSpacing: true,
                    arrowParens: 'always',
                    singleAttributePerLine: true
                }
            ],

            // Прочие правила
            'unused-imports/no-unused-imports': 'warn',
            'object-shorthand': [
                'warn',
                'properties',
                { avoidQuotes: true }
            ],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                {
                    prefer: 'type-imports',
                    disallowTypeAnnotations: false
                }
            ],
            '@typescript-eslint/consistent-type-exports': [
                'warn',
                {
                    fixMixedExportsWithInlineTypeSpecifier: true
                }
            ]
        },
        ignores: ["config/*", "**/cypress/support/component.ts", "vite.config.ts"],
    },
];