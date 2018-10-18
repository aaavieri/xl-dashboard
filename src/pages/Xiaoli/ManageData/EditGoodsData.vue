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
              <json-object-editor v-else-if="item.dataType == 'jsonObject'" :columnName="item.columnName" :editData="item.value" @update-object="updateObject"/>
              <json-array-editor v-else-if="item.dataType == 'jsonArray'" :columnName="item.columnName" :modelData="modelData" :editData="item.value" @update-array="updateArray"/>
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
        <div class="row">
          <div class="col-md-5"/>
          <div class="col-md-7">
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
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import { InputNumber, Input, Button, Select, Option, OptionGroup } from 'element-ui'
import swal from 'sweetalert2'
import JsonObjectEditor from 'src/pages/Dashboard/Components/JsonObjectEditor'
import JsonArrayEditor from 'src/pages/Dashboard/Components/JsonArrayEditor'
import PictureListEditor from 'src/pages/Dashboard/Components/PictureListEditor'
import dummyData from './dummyData'
export default {
  components: {
    PictureListEditor,
    JsonObjectEditor,
    [InputNumber.name]: InputNumber,
    [Input.name]: Input,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [OptionGroup.name]: OptionGroup,
    [JsonObjectEditor.name]: JsonObjectEditor,
    [JsonArrayEditor.name]: JsonArrayEditor,
    [PictureListEditor.name]: PictureListEditor
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
      modelData: ['问题', '答案']
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
          swal({
            title: '初始化失败!',
            text: response.data.errMsg,
            type: 'success',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'OK',
            buttonsStyling: false
          })
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
      if (this.actionType == 1) {
        swal({
          title: '操作失败!',
          text: '目录已经是新建状态',
          type: 'error',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'OK',
          buttonsStyling: false
        })
        return
      }
      this.actionType = 1
      this.clearData()
      swal({
        title: '新建数据!',
        text: '原数据已清空，请填写数据后保存',
        type: 'success',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: 'OK',
        buttonsStyling: false
      })
    },
    copyToNewData () {
      if (this.actionType == 1) {
        swal({
          title: '操作失败!',
          text: '目录已经是新建状态',
          type: 'error',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'OK',
          buttonsStyling: false
        })
        return
      }
      this.actionType = 1
      this.rowData.rowVersion = 1
      this.rowData.id = null
      this.editData.find((item) => item.columnName === 'id').value = null
      swal({
        title: '复制成功!',
        text: '请修改数据后保存',
        type: 'success',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: 'OK',
        buttonsStyling: false
      })
    },
    saveData () {
      var rowData = this.rowData
      for (var i = 0; i < this.editData.length; i++) {
        var item = this.editData[i]
        if (item.editable && !item.nullable && (item.value == null || (typeof  item.value == 'string' && item.value.trim() == ''))) {
          swal({
            title: '保存失败!',
            text: `请输入【${item.label}】`,
            type: 'error',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'OK',
            buttonsStyling: false
          })
          return
        }
        rowData[item.columnName] = item.value
      }
      var url = `/api/updateGoods/${rowData.id}`
      if (this.actionType === 1) {
        url = '/api/addGoods'
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
          swal({
            title: '保存失败!',
            text: response.data.errMsg,
            type: 'error',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'OK',
            buttonsStyling: false
          })
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
