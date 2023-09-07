module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
    './.eslintrc-auto-import.json'
  ],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'requireConfigFile': false,
    'parser': '@babel/eslint-parser'
  },
  'plugins': [
    'vue',
    'prettier'
  ],
  'globals': {},
  'rules': {
    "no-unused-vars":"off", // 关闭检查未使用的变量
    //关闭eslint检查文件名是否为驼峰命名
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off', // 关闭检查全局变量
    'no-empty': 'off', // 关闭检查空语句块
  }
}
