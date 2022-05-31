<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="getValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { i18nChangeLanguage } from '@wangeditor/editor';

export default {
  name: 'WangEditor',
  components: { 
    Editor, 
    Toolbar 
  },
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'en' // en || zh-CN
    }
  },
  watch: {
    disabled(val) {
      if (val) {
        this.editor.disable()
      } else {
        this.editor.enable()
      }
    }
  },
  data() {
    return {
      editor: null, // 实例
      toolbarConfig: {},
      editorConfig: { 
        placeholder: '请输入内容...'
      },
      mode: 'default', // or 'simple'
    }
  },
  methods: {
    onCreated(e) {
      const editor = Object.seal(e) // 一定要用 Object.seal() ，否则会报错
      // 设置多语言
      i18nChangeLanguage(this.language);
      
      if (this.disabled) {
        editor.disable()
      } else {
        editor.enable()
      }
      this.editor = editor
    },
  },
  computed: {
    getValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>