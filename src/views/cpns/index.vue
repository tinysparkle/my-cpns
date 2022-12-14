<template>
  <div>
    <h1>3D 轮播图</h1>
    <Slider3D/>
    <h1>文件上传</h1>
    <Upload v-model="photo" :multiple="true" clipping />
    <h1>WangEditor</h1>
    <WangEditor 
      language="zh-CN"
      :disabled="false"
      v-model="editorVal"/>
    <DragList
      v-model="columns">
      <template v-slot:default="scope">
          {{ scope.row }}
      </template>
    </DragList>

    <ElDatePickerWrapper v-model="datePickValue" />
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
        columns: [
          { draggable: true, label: '第1层', index: 1 },
          { draggable: true, label: '第2层', index: 2 },
          { draggable: false, label: '第3层', index: 3 },
          { draggable: true, label: '第4层', index: 4 },
          { draggable: true, label: '第5层', index: 5 },
        ],
        photo: '',
        datePickValue: Date.now()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>