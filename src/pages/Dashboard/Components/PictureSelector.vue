<template>
  <picture-viewer :show-data.sync="innerData" :li-footer-height-rate="0.2">
    <span slot="other-actions"
          slot-scope="fileInfo"
          class="el-upload-list__item-delete"
          @click="handleRemove(fileInfo.data.index, fileInfo.data.file.id)">
      <i class="el-icon-delete"></i>
    </span>
    <el-radio v-model="innerSelectPicId"
              style="margin-top: 20px; width: 100%"
              align="center"
              slot="li-footer"
              slot-scope="fileInfo"
              :label="fileInfo.data.file.id">
      {{selectLabel}}
    </el-radio>
    <el-upload
      v-if="addable"
      slot="after"
      style="display: contents"
      :action="uploadAction"
      :data="uploadParams"
      list-type="picture-card"
      :file-list="uploadFileList"
      :limit="1"
      :on-success="handleSuccess">
      <i class="el-icon-plus"></i>
    </el-upload>
  </picture-viewer>
</template>

<script>
import { Upload, Message, Radio } from 'element-ui'
import swal from 'sweetalert2'
import PictureViewer from "./PictureViewer"
export default {
  name: 'PictureSelector',
  components: {
    [Upload.name]: Upload,
    [Radio.name]: Radio,
    [PictureViewer.name]: PictureViewer
  },
  props: {
    columnName: String,
    selectPicId: Number,
    addable: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Array,
      default: () => []
    },
    uploadAction: {
      type: String,
      default: ''
    },
    uploadParams: {
      type: Object,
      default: () => {}
    },
    selectLabel: {
      type: String,
      default: '选择'
    }
  },
  data () {
    return {
      innerData: [],
      imageUrl: '',
      innerSelectPicId: 0,
      uploadFileList: []
    }
  },
  methods: {
    deleteData (index) {
      this.innerData.splice(index, 1)
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        Message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        Message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleSuccess (response, file, fileList) {
      this.innerData.push(response.data)
      this.uploadFileList.pop()
    },
    handleRemove (index, removeId) {
      this.innerData.splice(index, 1)
      if (removeId === this.innerSelectPicId) {
        this.innerSelectPicId = 0
      }
    },
    cancelData () {
      this.innerData.splice(0, this.innerData.length)
      this.innerData.push(...this.editData)
      this.innerSelectPicId = this.selectPicId || 0
      return true
    },
    saveData () {
      this.$emit('select-picture', this.innerSelectPicId, this.columnName, this.innerData)
      return true
    }
  },
  mounted () {
    this.innerData.splice(0, this.innerData.length)
    this.innerData.push(...this.editData)
    this.innerSelectPicId = this.selectPicId || 0
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 90%;
    height: 90%;
    line-height: 100%;
    text-align: center;
  }
  .avatar {
    width: 90%;
    height: 90%;
    display: block;
  }
</style>
