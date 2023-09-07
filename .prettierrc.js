// .prettierrc.js
module.exports = {
  printWidth: 100,
  tabWidth: 2,// 使用2个空格缩进
  useTabs: false, // 是否使用tab进行缩进，默认为false
  singleQuote: true, // 是否使用单引号代替双引号，默认为false
  semi: false, // 行尾是否使用分号，默认为true
  trailingComma: 'none', // 代码末尾不需要逗号
  arrowParens: 'avoid',  // 单个参数的箭头函数不加括号 x => x
  bracketSpacing: true, // 对象大括号内两边是否加空格 { a:0 }
  endOfLine: 'auto',// 文件换行格式 LF/CRLF
  htmlWhitespaceSensitivity: 'strict' // 根据显示样式决定html要不要折行
};
