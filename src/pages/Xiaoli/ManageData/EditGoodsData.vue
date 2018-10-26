<template>
  <div class="row" @keyup.alt.82="goBack()" @keyup.alt.83="saveData()" @keyup.alt.67="copyToNewData()" @keyup.alt.78="newData()">
    <div class="col-12">
      <card>
        <h4 slot="header" class="card-title">
          {{title}}
        </h4>
        <div class="row">
          <div class="col-md-4" v-for="(item, index) in editData" :key="index">
            <!--<fg-input :label="item.label" v-if="item.dataType == 'string'" v-model="item.value"/>-->
            <!--<div class="form-group  has-label" v-else-if="item.dataType == 'number'">-->
            <!--<label>{{item.label}}</label>-->
            <!--<el-input-number v-model="item.value" :disabled="true"></el-input-number>-->
            <!--</div>-->
            <div class="form-group  has-label">
              <label>{{item.label}}</label>
              <el-input ref="stringInput" v-model="item.value" v-if="item.dataType == 'string'" :disabled="!item.editable" :placeholder="getPlaceholder(item)" />
              <el-input-number v-model="item.value" v-else-if="item.dataType == 'number'" :disabled="!item.editable" :placeholder="getPlaceholder(item)"/>
              <el-input type="textarea" v-model="item.value" :autosize=true v-else-if="item.dataType == 'text'" :disabled="!item.editable" :placeholder="getPlaceholder(item)"/>
              <!--<json-object-editor v-else-if="item.dataType == 'jsonObject'" :columnName="item.columnName" :editData="item.value" @update-object="updateObject"/>-->
              <!--<json-array-editor v-else-if="item.dataType == 'jsonArray'" :columnName="item.columnName" :modelData="modelData" :editData="item.value" @update-array="updateArray"/>-->
              <template v-else-if="item.dataType === 'jsonArray' || item.dataType === 'jsonObject' || item.dataType === 'imgSelect'">
                <el-button type="primary" icon="el-icon-edit" @click="showSpecial(item)" round style="width: 100%">
                  编辑{{item.label}}
                </el-button>
              </template>
              <!--<picture-list-editor v-else-if="item.dataType == 'imgList'"-->
                                   <!--:columnName="item.columnName"-->
                                   <!--:editData="item.value"-->
                                   <!--:displayMode="1"-->
                                   <!--ref="pictureEditor"-->
                                   <!--@update-picture-list="updatePictureList"/>-->
              <el-select ref="select" v-model="item.value" v-else-if="item.dataType == 'dictionary'" :disabled="!item.editable" filterable :placeholder="getPlaceholder(item)" >
                <el-option-group>
                <el-option :value=0>
                  <div style="display: block" @click.stop="addOption(item)">
                    添加新数据
                  </div>
                </el-option>
                </el-option-group>
                <el-option-group >
                <el-option
                  v-for="option in getDictionary(item.columnName)"
                  :key="option.value"
                  :label="option.name"
                  :value="option.value">
                </el-option>
                </el-option-group>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 20px">
          <el-row class="col-md-12" style="margin-top: 20px" type="flex" justify="end">
            <el-button class="select-primary mb-3" type="success" icon="el-icon-check" round :loading="isSaving" @click="saveData()">
              保存(S)
            </el-button>
            <el-button class="select-primary mb-3" type="warning" icon="el-icon-plus" round :loading="isSaving" @click="newData()">
              新建(N)
            </el-button>
            <el-button class="select-primary mb-3" type="info" icon="el-icon-circle-plus-outline" round :loading="isSaving" @click="copyToNewData()">
              复制新建(C)
            </el-button>
            <el-button class="select-primary mb-3" type="primary" icon="el-icon-back" round @click="goBack()">
              返回(R)
            </el-button>
          </el-row>
        </div>
      </card>
    </div>
    <el-dialog :visible.sync="showChild" :title="childItem.label">
      <json-array-editor ref="childEditor" v-if="childItem.dataType === 'jsonArray'"
                         :column-name="childItem.columnName"
                         :model-data="modelData"
                         :edit-data="childItem.value"
                         @update-array="updateArray"/>
      <json-object-editor ref="childEditor" v-else-if="childItem.dataType === 'jsonObject'"
                          :column-name="childItem.columnName"
                          :edit-data="childItem.value"
                          :placeholder-label="childItem.label"
                          @update-object="updateObject"/>
      <picture-selector ref="childEditor" v-else-if="childItem.dataType === 'imgSelect'"
                        :column-name="childItem.columnName"
                        upload-action="/backend/faces/file/uploadSingleMallPic"
                        :edit-data="getPictureList(childItem)"
                        :addable="true"
                        select-label="设为封面"
                        :select-pic-id="childItem.value"
                        @select-picture="selectPicture">
      </picture-selector>
      <div class="row" slot="footer" style="margin: -30px 0 -10px 0">
        <el-row type="flex" class="col-md-4">
          <el-button class="select-primary mb-3" type="warning" icon="el-icon-plus" round @click="newChildData()"
                     v-if="childItem.dataType !== 'imgSelect'">
            添加
          </el-button>
        </el-row>
        <el-row type="flex" justify="end" class="col-md-8">
          <el-button class="select-primary mb-3" type="success" icon="el-icon-check" round @click="saveChildData()">
            确定
          </el-button>
          <el-button class="select-primary mb-3" type="primary" icon="el-icon-close" round @click="cancelChildData()">
            取消
          </el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { InputNumber, Input, Button, Select, Option, OptionGroup, Dialog, Row } from 'element-ui'
import swal from 'sweetalert2'
import JsonObjectEditor from '../../Dashboard/Components/JsonObjectEditor'
import JsonArrayEditor from '../../Dashboard/Components/JsonArrayEditor'
import PictureSelector from '../../Dashboard/Components/PictureSelector'
import dummyData from './dummyData'
export default {
  components: {
    [InputNumber.name]: InputNumber,
    [Input.name]: Input,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [OptionGroup.name]: OptionGroup,
    [JsonObjectEditor.name]: JsonObjectEditor,
    [JsonArrayEditor.name]: JsonArrayEditor,
    [PictureSelector.name]: PictureSelector,
    [Dialog.name]: Dialog,
    [Row.name]: Row
  },
  name: 'EditGoodsData',
  data () {
    return {
      actionType: 1,
      dataType: 3,
      rowData: {},
      editData: [],
      centerDialogVisible: false,
      isSaving: false,
      modelData: ['问题', '答案'],
      showChild: false,
      childItem: {}
    }
  },
  computed: {
    title () {
      var title = ''
      switch (this.actionType) {
        case 2:
          title += '修改'
          break
        default:
          title += '新建'
      }
      return title + '商城商品数据'
    }
  },
  methods: {
    init () {
      this.getData()
    },
    addOption (item) {
      let editData = this
      this.$refs.select.map((select) => {
        select.blur()
      })
      swal({
        title: `输入${item.label}的新数据`,
        input: 'text',
        // inputPlaceholder: 'Enter your name or nickname',
        showCancelButton: true,
        inputValidator: (value) => {
          return !value && '请输入数据'
        }
      }).then((result) => {
        if (result.value) {
          let tableName = editData.getTableName()
          editData.$dictionary.generateNewItem(tableName, item.columnName, result.value, editData.dataType, null)
        }
      })
    },
    getPlaceholder(item) {
      if (!item.editable) {
        return `自动生成${item.label}`
      } else if (item.dataType == 'dictionary') {
        return `请选择${item.label}`
      } else {
        return `请输入${item.label}`
      }
    },
    getData () {
      let editData = this
      this.$http.get(`/api/getColumnInfo/${this.dataType}`).then(response => {
        if (response.data.success) {
          // editData.columnInfo = response.data.data
          editData.initField(response.data.data)
        } else {
          editData.$msgAlert.showSimpleErrorMsg('初始化失败')
        }
      })
    },
    initField (data) {
      this.editData = data.filter(item => item.editDisplay)
        .sort((item1, item2) => item1.order - item2.order)
        .map(item => {
          item.value = (this.rowData[item.columnName] ? this.rowData[item.columnName] : null)
          return item
        })
      this.setFoucs()
    },
    setFoucs () {
      this.$nextTick(() => {
        if (this.$refs.stringInput && this.$refs.stringInput.length > 1) {
          this.$refs.stringInput[1].focus()
        }
      })
    },
    getDictionary (type) {
      return this.$dictionary.getDictByType(this.getTableName(), type)
    },
    getTableName() {
      return 't_mall_goods'
    },
    newData () {
      if (this.actionType === 1) {
        this.$msgAlert.showSimpleErrorMsg('目录已经是新建状态')
        return
      }
      this.actionType = 1
      this.clearData()
      this.$msgAlert.showSimpleSuccessMsg('原数据已清空，请填写数据后保存')
    },
    copyToNewData () {
      if (this.actionType === 1) {
        this.$msgAlert.showSimpleErrorMsg('目录已经是新建状态')
        return
      }
      this.actionType = 1
      this.rowData.rowVersion = 1
      // this.rowData.id = null
      // this.editData.find((item) => item.columnName === 'id').value = null
      this.clearDataByKey('id', 'coverPicId')
      this.rowData.pictureList = []
      this.$msgAlert.showSimpleSuccessMsg('复制成功，请修改数据后保存')
    },
    clearDataByKey () {
      let page = this
      let keys = Array.prototype.slice.apply(arguments)
      keys.map(key => {
        page.rowData[key] = null
        let item = page.editData.find(item => item.columnName === key)
        if (item) {
          item.value = null
        }
      })
    },
    saveData () {
      var rowData = this.rowData
      for (var i = 0; i < this.editData.length; i++) {
        var item = this.editData[i]
        if (item.editable && !item.nullable && (item.value == null || (typeof  item.value == 'string' && item.value.trim() == ''))) {
          this.$msgAlert.showSimpleErrorMsg(`请输入【${item.label}】`)
          return
        }
        rowData[item.columnName] = item.value
      }
      var url = `/api/v2/updateGoods/${rowData.id}`
      if (this.actionType === 1) {
        url = '/api/v2/addGoods'
      }
      let editData = this
      this.$http.post(url, {rowData}).then(response => {
        if (response.data.success) {
          swal({
            title: '保存成功',
            text: `成功保存 ${rowData.name}，是否返回列表？`,
            type: 'success',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success btn-fill',
            cancelButtonClass: 'btn btn-danger btn-fill',
            confirmButtonText: '否',
            cancelButtonText: '是',
            buttonsStyling: false
          }).then((result) => {
            if (result.value) {
              if (editData.actionType ===  1) {
                editData.rowData.rowVersion = 1
                editData.rowData.id = response.data.data
                editData.editData.find((item) => item.columnName === 'id').value = response.data.data
                editData.actionType = 2
              } else {
                editData.rowData.rowVersion += 1
              }
              var tempData = editData.editData
              editData.editData = []
              editData.$nextTick(() => {
                editData.editData = tempData
                editData.setFoucs()
              })
            } else {
              editData.goBack()
            }
          })
          // editData.centerDialogVisible = true
        } else {
          this.$msgAlert.showSimpleErrorMsg(`保存失败，错误原因：【${response.data.errMsg}】`)
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    clearData() {
      this.editData = this.editData.map((item) => {
        item.value = null
        return item
      })
      this.showChild = false
      this.childItem = {}
      this.rowData = {}
    },
    checkLogin (callback) {
      var app = this
      this.$http.post('/users/checkLogin').then(response => {
        if (!response.data.success) {
          swal({
            title: '请求错误!',
            text: response.data.errMsg,
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

    updateObject (value, columnName) {
      this.editData.find(item => item.columnName === columnName).value = value
    },
    updateArray (value, columnName) {
      this.editData.find(item => item.columnName === columnName).value = value
    },
    updatePictureList (value, columnName) {
      this.editData.find(item => item.columnName === columnName).value = value
    },
    showSpecial (item) {
      this.showChild = true
      this.childItem = item
    },
    newChildData () {
      this.$refs.childEditor.newData()
    },
    saveChildData () {
      if (this.$refs.childEditor.saveData()) {
        this.showChild = false
        this.$msgAlert.showSimpleSuccessMsg(`已暂时保存${this.childItem.label}数据`)
      }
    },
    cancelChildData () {
      if (this.$refs.childEditor.cancelData()) {
        this.showChild = false
        this.$msgAlert.showSimpleSuccessMsg('已返回修改前数据')
      }
    },
    getPictureList (item) {
      return this.rowData.pictureList
    },
    selectPicture (value, columnName, pictureList) {
      this.editData.find(item => item.columnName === columnName).value = value
      this.rowData.pictureList = pictureList
    }
  },
  mounted () {
    this.actionType = this.$route.params.actionType || this.actionType
    this.dataType = this.$route.params.dataType || this.dataType
    this.rowData = this.$route.params.rowData || this.rowData
    this.checkLogin(this.init)
  }
}
</script>

<style scoped>

</style>
