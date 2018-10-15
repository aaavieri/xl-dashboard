<template>
  <div class="row">
    <div class="col-12">
      <card>
        <!--<h4 slot="header" class="card-title">{{dataTypeName}}数据一览</h4>-->
        <div class="row">
          <div class="col-md-12" v-for="(item, index) in innerData" :key="index">
            <div class="form-group  has-label">
                <label>属性{{index + 1}}</label>
                <el-input class="attribute-input" v-model="item.name" placeholder="请输入属性名" />
                <el-input class="attribute-input" v-model="item.value" :placeholder="getPlaceholder(item, index)" @input="inputComplete()"/>
            </div>
            <hr align="center" width="300" color="#987cb9" SIZE="1" v-if="index < innerData.length - 1"/>
          </div>
          <div class="col-md-12">
            <el-button class="select-primary mb-3" type="warning" icon="el-icon-plus" round @click="newData()">
            添加新属性
            </el-button>
          </div>
        </div>
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
import { Button } from 'element-ui'
export default {
  name: 'JsonObjectEditor',
  components: {
    [Button.name]: Button
  },
  props: {
    editData: {
      type: String
    },
    columnName: {
      type: String,
      validator: value => value
    }
  },
  data () {
    return {
      innerData: this.editData ? JSON.parse(this.editData) : [{
        name: '',
        value: ''
      }]
    }
  },
  methods: {
    getPlaceholder (item, index) {
      return item.name ? `请输入${item.name}` : `请输入属性${index + 1}`
    },
    newData () {
      this.innerData.push({
        name: '',
        value: ''
      })
    },
    inputComplete () {
      this.$emit('update-object', JSON.stringify(this.innerData), this.columnName)
    }
  }
}
</script>

<style scoped>
.attribute-input {
  margin-bottom: 5px;
}
</style>
