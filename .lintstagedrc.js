const { CLIEngine } = require('eslint')

const cli = new CLIEngine({})

module.exports = {
    'src/**/*.{ts,tsx}': [
        files => 'eslint --max-warnings=0 ' + files.filter(file => !cli.isPathIgnored(file)).join(' '),
        'prettier --write'
    ],
    'src/**/*.scss': ['stylelint --fix', 'prettier --write']
}
