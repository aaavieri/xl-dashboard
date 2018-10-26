<template>
  <div class="row">
    <div class="col-12">
      <card>
        <!--<h4 slot="header" class="card-title">{{dataTypeName}}数据一览</h4>-->
        <!--<div class="row">-->
          <div class="col-md-12">
            <div class="form-group  has-label col-md-4" style="display: inline-block" v-for="(item, index) in innerData" :key="index">
              <label>{{placeholderLabel}}{{index + 1}}</label>
              <el-input class="attribute-input" v-model="item.name" :placeholder="getPlaceholderName(item, index)" />
              <el-input class="attribute-input" v-model="item.value" :placeholder="getPlaceholderValue(item, index)"/>
              <el-row type="flex" justify="end">
                <el-button class="select-primary mb-3 line-in-editor" type="danger" icon="el-icon-delete" round @click="deleteData(index)"/>
              </el-row>
              <!--<hr align="center" width="100%" color="#987cb9" SIZE="1" v-if="index < innerData.length - 1"/>-->
            </div>
          </div>
          <!--<div class="col-md-12">-->
            <!--<el-button class="select-primary mb-3" type="warning" icon="el-icon-plus" round @click="newData()">-->
            <!--添加新属性-->
            <!--</el-button>-->
          <!--</div>-->
        <!--</div>-->
      </card>
    </div>
  </div>
</template>

<script>
import { Button, Row, Message } from 'element-ui'
export default {
  name: 'JsonObjectEditor',
  components: {
    [Button.name]: Button,
    [Row.name]: Row
  },
  props: {
    editData: {
      type: String
    },
    columnName: {
      type: String,
      validator: value => value
    },
    placeholderLabel: {
      type: String,
      default: '属性'
    }
  },
  data () {
    return {
      innerData: this.editData ? JSON.parse(this.editData) : []
    }
  },
  methods: {
    getPlaceholderName (item, index) {
      return `请输入${this.placeholderLabel}名${index + 1}`
    },
    getPlaceholderValue (item, index) {
      return item.name ? `请输入${item.name}` : `请输入${this.placeholderLabel}值${index + 1}`
    },
    newData () {
      this.innerData.push({
        name: '',
        value: ''
      })
    },
    deleteData (index) {
      this.innerData.splice(index, 1)
    },
    saveData () {
      if (this.checkData()) {
        this.$emit('update-object', JSON.stringify(this.innerData), this.columnName)
        return true
      } else {
        return false
      }
    },
    cancelData () {
      this.innerData = this.editData ? JSON.parse(this.editData) : [{
        name: '',
        value: ''
      }]
      return true
    },
    checkData () {
      for (let i = 0; i < this.innerData.length; i++) {
        if (this.innerData[i].name.trim() === '') {
          Message({
            message: `第${i + 1}条数据的${this.placeholderLabel}名为空`,
            type: 'error'
          })
          return false
        } else if (this.innerData[i].value.trim() === '') {
          Message({
            message: `第${i + 1}条数据的${this.placeholderLabel}值为空`,
            type: 'error'
          })
          return false
        }
      }
      return true
    }
  },
  mounted () {
    if (this.innerData.length === 0) {
      this.innerData.push({
        name: '',
        value: ''
      })
    }
  }
}
</script>

<style scoped>
.attribute-input {
  margin-bottom: 5px;
}
</style>
