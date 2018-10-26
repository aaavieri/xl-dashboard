<template>
  <div class="row">
    <div class="col-12">
      <card>
        <!--<h4 slot="header" class="card-title">{{dataTypeName}}数据一览</h4>-->
        <!--<div class="row">-->
          <div class="col-md-12" v-for="(item, index) in innerData" :key="index">
            <div class="form-group  has-label array-item-group line-in-editor" v-for="(model, indexModel) in modelData" :key="'model' + indexModel">
              <label>{{model}}{{index + 1}}</label>
              <el-input class="attribute-input" v-model="item[indexModel]" placeholder="请输入属性名"/>
            </div>
            <el-row type="flex" justify="end">
              <el-button class="select-primary mb-3 line-in-editor" type="danger" icon="el-icon-delete" round @click="deleteData(index)"/>
            </el-row>
            <hr align="center" width="100%" color="#987cb9" SIZE="1" v-if="index < innerData.length - 1"/>
          </div>
          <!--<div class="col-md-12">-->
            <!--<el-button class="select-primary mb-3" type="warning" icon="el-icon-plus" round @click="newData()">-->
            <!--添加-->
            <!--</el-button>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
          <!--<div class="col-md-5"/>-->
          <!--<div class="col-md-7">-->
            <!--<el-button class="select-primary mb-3" type="success" icon="el-icon-check" round :loading="isSaving" @click="saveData()">-->
              <!--保存(S)-->
            <!--</el-button>-->
            <!--<el-button class="select-primary mb-3" type="warning" icon="el-icon-plus" round :loading="isSaving" @click="newData()">-->
              <!--新建(N)-->
            <!--</el-button>-->
            <!--<el-button class="select-primary mb-3" type="primary" icon="el-icon-back" round @click="goBack()">-->
              <!--返回(R)-->
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
  name: 'JsonArrayEditor',
  components: {
    [Button.name]: Button,
    [Row.name]: Row
  },
  props: {
    editData: {
      type: String
    },
    modelData: {
      type: Array,
      validator: (value) => value.length > 0
    },
    columnName: {
      type: String,
      validator: value => value
    }
  },
  data () {
    return {
      innerData: this.editData ? JSON.parse(this.editData) : []
    }
  },
  methods: {
    newData () {
      this.innerData.push(new Array(this.modelData.length).fill(''))
    },
    deleteData (index) {
      this.innerData.splice(index, 1)
    },
    saveData () {
      if (this.checkData()) {
        this.$emit('update-array', JSON.stringify(this.innerData), this.columnName)
        return true
      } else {
        return false
      }
    },
    cancelData () {
      this.innerData = this.editData ? JSON.parse(this.editData) : [new Array(this.modelData.length).fill('')]
      return true
    },
    checkData () {
      for (let i = 0; i < this.innerData.length; i++) {
        for (let j = 0; j < this.modelData.length; j++) {
          if (this.innerData[i][j].trim() === '') {
            Message({
              message: `第${i + 1}条数据的${this.modelData[j]}为空`,
              type: 'error'
            })
            return false
          }
        }
      }
      return true
    }
  },
  mounted () {
    if (this.innerData.length === 0) {
      this.innerData.push(new Array(this.modelData.length).fill(''))
    }
  }
}
</script>

<style scoped>
.attribute-input {
  margin-bottom: 5px;
}
.array-item-group {
  margin-bottom: 10px;
}
</style>
