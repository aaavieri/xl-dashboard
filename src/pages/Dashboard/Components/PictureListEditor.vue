<template>
  <div class="row">
    <div class="col-12">
      <card>
        <!--<h4 slot="header" class="card-title">{{dataTypeName}}数据一览</h4>-->
        <div class="row">
          <div class="col-md-12">
            <!--<el-upload-->
              <!--:action="uploadAction"-->
              <!--:data="uploadParams"-->
              <!--:on-success="handleSuccess"-->
              <!--:on-preview="handlePreview"-->
              <!--:on-remove="handleRemove"-->
              <!--:file-list="innerData"-->
              <!--:limit="maxFile"-->
              <!--list-type="picture">-->
              <!--<el-button size="small" type="primary">点击上传</el-button>-->
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            <!--</el-upload>-->
            <el-upload
              :action="uploadAction"
              :data="uploadParams"
              :list-type="getListType()"
              :file-list="innerData"
              :auto-upload="getAutoUpload()"
              :limit="maxFile"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus" v-if="displayMode === 2"></i>
              <el-button size="small" type="primary" v-if="displayMode === 1">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" v-if="displayMode === 1">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </div>
        <div class="row" style="height: 10px" v-if="displayMode === 2">
        </div>
        <div class="row" v-if="displayMode === 2">
          <div class="col-md-10"/>
          <div class="col-md-2">
            <el-button class="select-primary mb-3" type="primary" icon="el-icon-back" round @click="goBack()">
              返回(R)
            </el-button>
          </div>
        </div>
      </card>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { Upload, Button, Dialog } from 'element-ui'
import swal from 'sweetalert2'
export default {
  name: 'PictureListEditor',
  components: {
    [Upload.name]: Upload,
    [Button.name]: Button,
    [Dialog.name]: Dialog
  },
  props: {
    displayMode: {
      type: Number,
      // 1：以控件的形式显示在页面中，2：以页面单独存在
      default: 2
    },
    editData: {
      type: Array,
      default: () => []
    },
    uploadAction: {
      type: String,
      validator: value => value
    },
    uploadParams: {
      type: Object,
      default: () => {}
    },
    getAction: {
      type: String,
      default: ''
    },
    getParams: {
      type: Object,
      default: () => {}
    },
    removeAction: {
      type: String,
      default: ''
    },
    removeParams: {
      type: Object,
      default: () => {}
    },
    maxFile: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      innerData: [],
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    getListType () {
      switch (this.displayMode) {
        case 1:
          return 'picture'
        case 2:
          return 'picture-card'
        default:
          return 'picture-card'
      }
    },
    getAutoUpload () {
      switch (this.displayMode) {
        case 1:
          return false
        case 2:
          return true
        default:
          return false
      }
    },
    getPlaceholder (item, index) {
      return item.name ? `请输入${item.name}` : `请输入属性${index + 1}`
    },
    deleteData (index) {
      this.innerData.splice(index, 1)
      this.inputComplete()
    },
    editComplete () {
      if (this.displayMode === 1) {
        this.$emit('update-picture-list', this.innerData, this.columnName)
      }
    },
    handleSuccess (response, file, fileList) {
      this.innerData.push(response.data)
      this.editComplete()
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      if (this.displayMode === 2) {
        let editor = this
        this.$http.post(this.removeAction, Object.assign({}, this.removeParams, {file})).then(response => {
          if (!response.data.success) {
            swal({
              title: '删除失败!',
              text: response.data.errMsg,
              type: 'error',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            })
            fileList.push(file)
          } else {
            swal({
              title: '删除成功!',
              text: '删除成功!',
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            })
          }
          editor.innerData = fileList
        })
      } else if (this.displayMode === 1) {
        this.editComplete()
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    checkLogin (callback) {
      let app = this
      this.$http.post('/users/checkLogin').then(response => {
        if (!response.data.success) {
          swal({
            title: '请求错误!',
            text: response.data.errMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            app.$router.push('/loginBack')
          })
        } else {
          if (callback) {
            callback()
          }
        }
      })
    },
    initPictureList () {
      if (this.displayMode === 2) {
        let editor = this
        this.$http.get(this.getAction, this.getParams).then(response => {
          if (response.data.success) {
            editor.innerData = response.data.data
          } else {
            swal({
              title: '初始化失败!',
              text: response.data.errMsg,
              type: 'error',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            })
          }
        })
      } else if (this.displayMode === 1) {
        this.innerData = this.editData || []
      }
    }
  },
  mounted () {
    if (this.displayMode === 1) {
      this.initPictureList()
    } else if (this.displayMode === 2) {
      this.checkLogin(this.initPictureList)
    }
  }
}
</script>

<style scoped>
.attribute-input {
  margin-bottom: 5px;
}
</style>
