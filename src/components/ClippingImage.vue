<template>
  <el-dialog
    width="500px"
    top="2vh"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible">
    <div class="clipping-container">
        <VueCropper
            ref="cropper"
            :img="file"
            :output-size="option.size"
            :full="option.full"
            :fixed="true"
            :fixed-number="fixedNumber"
            :center-box="option.centerBox"
            :auto-crop="option.autoCrop"
            :auto-crop-width="autoCropSize[0]"
            :auto-crop-height="autoCropSize[1]"
            mode="cover"/>
    </div>
    <div slot="footer">
        <el-button
            @click="cancel">
            Cancel
        </el-button>
        <el-button
            type="primary"
            @click="done">
            Done
        </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { VueCropper } from 'vue-cropper'

  export default {
    components: {
      VueCropper
    },
    props: {
      file: '',
      dialogVisible: {
        type: Boolean,
        default: false
      },
      autoCropSize: {
        type: Array,
        default() {
          return []
        }
      },
      fixedNumber: {
        type: Array,
          default() {
            return []
          }
      }
    },
    data() {
      return {
        option: {
          size: 0.6, // 裁剪生成图片的质量 0.1 ~ 1
          original: false, // 上传图片按照原始比例渲染
          full: true, // 是否输出原图比例的截图
          centerBox: '', // 截图框是否被限制在图片里面
          autoCrop: true //是否默认生成截图框
        }
      }
    },
    methods: {
      done() {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit('done', new File([data], 'temp.jpeg'))
        })
      },
      cancel() {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit('cancel')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .clipping-container {
    width: 400px;
    height: 300px;
  }
</style>