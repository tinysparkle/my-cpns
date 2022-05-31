<template>
  <div>
    <h1>3D 轮播图</h1>
    <Slider3D/>
    <h1>文件上传</h1>
    <Upload accept="image/jpeg" />
    <h1>WangEditor</h1>
    <WangEditor 
      language="zh-CN"
      :disabled="false"
      v-model="editorVal"/>
  </div>
</template>

<script>
  // 自动注册'./cpns'目录下的组件
  const contexts = require.context('@/components', false, /\.vue$/);
  const Cpns = {}
  contexts.keys().forEach(key => {
    const cpns = contexts(key).default || {}
    const name = cpns.name;
    Cpns[name] = cpns
  })
  export default {
    components: {
      ...Cpns
    },
    data() {
      return {
        editorVal: '',
      }
    }
  }
</script>

<style lang="less" scoped>

</style>