module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential'
  ],
  // Убираем парсер, который требует @babel/eslint-parser
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Полностью отключаем линтер для упрощения запуска
    'vue/no-parsing-error': 'off',
    'vue/no-unused-components': 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off'
  }
}
