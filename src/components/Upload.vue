
<template>
  <div>
    <div 
      class="square-upload-pic-btn"
      @click="selectFile"
      :class="{ 'not-allowed': disabled }">
      <img v-if="imgUrl" :src="fileDomain + imgUrl" alt="">
      <i v-else :class="loading ? 'el-icon-loading' : 'el-icon-plus'"></i>

      <span v-if="imgUrl" class="img-action">
        <i class="img-action-preview el-icon-search" @click="previewPicture"/>
        <i v-show="edit || supportDelete" class="img-action-delete el-icon-delete" @click.stop="deletePicture"/>
      </span>

      <el-dialog
        width="40%"
        class="custom-dialog"
        :show-close="false"
        :visible.sync="enlargeDialogVisiable">
        <div class="simple-dialog">
          <img style="width: 100%; height: 100%" :src="fileDomain + imgUrl" alt="">
        </div>
      </el-dialog>
    </div>


    <input 
      @change="handleInputChange"
      ref="uploadInputRef"
      type="file" 
      :accept="accept" 
      :multiple="multiple"
      :disabled="disabled"
      class="upload-input">
  </div>
</template>

<script>

  export default {
    name: 'Upload',
    props: {
      imgUrl: {
        type: String
      },
      supportDelete: {
        type: Boolean,
        default: false
      },
      edit: {
        type: Boolean,
        default: false
      },
      /**
      * 文件类型
      * xls：application/vnd.ms-excel
      * xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      * jpg: image/jpeg
      * svg: image/svg+xml
      * zip: application/zip
      * pdf: application/pdf
      */
      accept: {
        type: String,
        required: true
      },
      // 上传文件大小，默认10M
      fileSize: {
        type: Number,
        default: 10
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      imageUrl: {
        type: String,
      },
      // 最大上传数量
      maxUploadNums: {
        type: Number,
        default: 10
      },
      // 限制比例，数组两项对应宽高
      customWH: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        loading: false,
        fileList: [],
        count: 0, // 限制图片宽高时用到, 当时数量与fileList数量相等，校验通过
        enlargeDialogVisiable: false
      }
    },
    methods: {
      previewPicture() {
        this.enlargeDialogVisiable = true
      },
      deletePicture() {
        this.$emit('remove')
      },
      selectFile() {
        if (this.imgUrl || this.disabled) return
        this.clearFile();
        this.$refs.uploadInputRef.click();
      },
      clearFile() {
        this.$refs.uploadInputRef.value = '';
        this.fileList = []
        this.count = 0
      },
      handleInputChange(e) {
        const file = e.target.files;
        this.fileList = Array.from(file)

        const _this = this
        if (this.customWH.length) {
          const width = this.customWH[0]
          const height = this.customWH[1]

          this.fileList.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file)

            reader.onload = function(e) {
              const data = e.target.result
              const img = new Image()
              img.src = data

              img.onload = function() {
                const imgW = img.width;
                const imgH = img.height;

                if (imgW === width && imgH === height) {
                  _this.count++
                }
              }
            }
          })
        }
        setTimeout(() => {
          this.uploadFile(this.fileList);
        })
      },
      uploadFile(fileList) {
        if (this.customWH.length) {
          if (fileList.length !== this.count) {
            return this.$message.error('图片宽高不符要求')
          }
        }

        const length = fileList.length;
        // 超出上传数量
        const overLenth = length > this.maxUploadNums

        // 超出上传大小
        const curFileSize = this.fileSize * 1024 * 1024
        const overSize = fileList.some(file => file.size > curFileSize)

        if (overLenth) {
          const str = this.$i18n.t('message.max_file_length_tips', { num: this.maxUploadNums })
          return this.$message.error(str)
        }

        if (overSize) {
          const str = this.$i18n.t('message.max_file_size_tips', { num: this.fileSize })
          return this.$message.error(str)
        }

        let formData = new FormData();

        this.loading = true

        const promiseList = []
        this.fileList.forEach((file, index) => {
          formData.append('file', file)
          formData.append('fileName', file.name)
          // 上传接口，返回oss地址
          // promiseList[index] = imgUpload(formData)
        })

        Promise.all(promiseList).then(res => {
          const data = res[0].data
          this.$message.success(this.$i18n.t('message.file_upload_success'))
          this.$emit('uploadSuccess', data)
        }).catch(err => {
          this.$message.warning(this.$i18n.t('message.file_upload_failed'))
        }).finally(() => {
          this.clearFile();
          this.loading = false
        })
      }
    },
    computed: {
      fileDomain() {
        // oss域名
        return 'https://images.jimuitech.com/'
      }
    }
  }
</script>

<style lang="less" scoped>
.upload-input {
 display: none;
}
.square-upload-pic-btn {
   position: relative;
   cursor: pointer;
   width: 120px;
   height: 120px;
   background-color: #fff;
   border-radius: 4px;
   border: 1px dashed #e7e7e7;
   display: flex;
   justify-content: center;
   align-items: center;
   .el-icon-plus {
     color: #ccc;
     font-size: 20px;
   }
   img {
     width: 120px;
     height: 120px;
   }
   .img-action {
     position: absolute;
     left: 0;
     top: 0;
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     height: 100%;
     background-color: rgba(0, 0, 0, 0.5);
     border-radius: 4px;
     cursor: pointer;
     opacity: 0;
     z-index: 99;

     &:hover {
          opacity: 1;
     }

     .img-action-preview {
          color: #FFFFFF;
          font-size: 20px;
     }

     .img-action-delete {
          margin-left: 36px;
          color: #FFFFFF;
          font-size: 20px;
     }
   }
   &.not-allowed {
     cursor: not-allowed !important;
   }
}
</style>