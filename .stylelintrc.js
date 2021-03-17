// @ts-nocheck
module.exports = {
    ignoreFiles: [
        'node_modules/**/*.scss',
        '**/*.md',
        '**/*.ts',
        '**/*.tsx',
        '**/*.js',
        '.prettierrc.js',
        '.eslintrc.js',
        '.stylelintrc.js',
        'dist/**/*.css'
    ],
    extends: ['stylelint-config-recommended', 'stylelint-config-recess-order'],
    rules: {
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global', 'local']
            }
        ],
        'at-rule-no-unknown': [true, { ignoreAtRules: ['mixin', 'include'] }]
    }
}
