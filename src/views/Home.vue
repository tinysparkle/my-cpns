<template>
  <div class="home-page">
    <Copy/>
    <Longpress/>
  </div>
</template>

<script>
  // 自动导入'./directives'目录下的组件
  const contexts = require.context('./directives', false, /\.vue$/);
  const Cpns = {}
  contexts.keys().forEach(key => {
    const context = contexts(key).default
    const name = context.name;
    Cpns[name] = context;
  })

  export default {
    components: {
      ...Cpns
    }
  }
</script>
