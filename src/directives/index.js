import Vue from 'vue';

// 自动导入并注册
const contexts = require.context('../directives', false, /\.js$/);
contexts.keys().forEach(key => {
  const directive = contexts(key).default;
  const name = key.slice(2, key.length - 3)
  Vue.directive(name, directive);
})

