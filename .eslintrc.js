module.exports = {
    plugins: ['prettier'],
    extends: [],
    root: true,
    env: {node: true},
    rules: {
        'no-console': 'error',
    },
    ignorePatterns: ['.eslintrc.js'],
};
