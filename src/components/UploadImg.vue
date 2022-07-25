<template>
  <div>
    <el-upload
      ref="upload"
      :class="{'hide-upload': photoList.length >= limit || disabled}"
      :action="action"
      :data="extraData"
      :headers="headers"
      list-type="picture-card"
      :auto-upload="!clipping"
      :before-upload="handleBeforeUpload"
      :on-preview="handlePreview"
      :http-request="proxyHttpRequest"
      :on-remove="handleRemove"
      :before-remove="beforeHandleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="photoList"
      :on-change="handleChange"
      accept="image/*"
      :multiple="multiple"
      :disabled="disabled">
      <i class="el-icon-plus"/>
    </el-upload>
  
    <!-- 预览弹窗 -->
    <el-dialog
        :visible.sync="dialogVisible"
        :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 裁剪图片 -->
    <ClippingImage
      v-if="clipping"
      :dialogVisible="clippingVisible"
      :file="clippingFile"
      :fixed-number="fixedNumber"
      :auto-crop-size="autoCropSize"
      @done="clippingDone"
      @cancel="clippingCancel"/>
  </div>
</template>

<script>
  import ClippingImage from './ClippingImage.vue'

  export default {
    name: 'Upload',
    components: {
      ClippingImage,
    },
    props: {
      value: String | Array,
      // 必选参数，上传的地址
      action: {
        type: String,
        default: '/default/upload/img'
      },
      // 上传时携带的额外参数
      extraData: {
        type: Object,
        default() {
          return {}
        }
      },
      // 设置上传的请求头部
      headers: {
        type: Object,
        default() {
          return {}
        }
      },
      // 是否支持裁剪
      clipping: {
        type: Boolean,
        default: false
      },
      // 限制图片大小 默认 5m
      fileSize: {
        type: Number,
        default: 5
      },
      // 限制上传数量 默认 1
      limit: {
        type: Number,
        default: 1
      },
      // 截图框的宽高比例
      fixedNumber: {
        type: Array,
        default() {
          return [3, 4]
        }
      },
      // 默认生成截图框宽高
      autoCropSize: {
        type: Array,
        default() {
          return [200, 300]
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否支持批量上传
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        clippingFile: '',
        originalFile: '',
        clippingVisible: false
      }
    },
    computed: {
      photoList: {
        get () {
          return this.value || []
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      // 上传前校验图片文件大小
      handleBeforeUpload(file) {
        if (!this.clipping && file.size > this.fileSize * 1024 * 1024) {
          this.$message.warning(`Images size must be up to ${ this.fileSize }M!`)
          return false
        }
      },
      // 预览图片
      handlePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 自定义上传
      proxyHttpRequest(args) {
        let otherOptions = {
            method: 'POST',
            headers: args.headers,
        }
        let formData = new FormData()
        formData.append('file', args.file)

        if (args.data) {
            Object.keys(args.data).forEach(v => {
                formData.append(v, args.data[v])
            })
        }
        // 接口
        // api.upload(args.action, formData).then(res => {
        //     args.onSuccess(res)
        // }).catch(err => {
        //     if (err.code) { // 如果返回了json还是用以前的onSuccess处理
        //         args.onSuccess(err)
        //     } else {        // http状态码不是200的适合用onError
        //         args.onError(err)
        //     }
        // })
      },
      beforeHandleRemove() {
        return this.$confirm('Confirm to delete?', '', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        })
      },
      handleRemove(file, fileList) {
        this.photoList = fileList.filter(item => item.uid !== file.uid)
        this.$emit('remove', fileList)
      },
      handleSuccess(response, file, fileList) {
        this.$emit('change', fileList)
      },
      handleError() {
        this.$message.error(err.message || 'System Error')
      },
      handleChange(file, fileList) {
        if (this.clipping && fileList.indexOf(file) > -1 && this.originalFile !== file) {
            this.originalFile = file
            this.clippingFile = window.URL.createObjectURL(file.raw)
            this.clippingVisible = true
        }
      },
      clippingDone (file) {
        this.clippingVisible = false
        file.uid = this.originalFile.raw.uid
        this.originalFile.raw = file
        this.$refs.upload.submit()
      },
      clippingCancel() {
        this.photoList = []
        this.clippingVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .limited-upload {
    .el-upload.el-upload--picture-card {
        display: none;
    }
  }
</style>