<template>
  <div class="row">
    <div class="col-12">
      <card>
        <h6 slot="header" class="card-title" v-if="title">{{title}}</h6>
          <!--<div class="col-md-12" v-for="(item, index) in innerData" :key="index">-->
            <!--<div class="form-group  has-label array-item-group" v-for="(model, indexModel) in modelData" :key="'model' + indexModel">-->
              <!--<label>{{model}}{{index + 1}}</label>-->
              <!--<label :class="className">{{item[indexModel]}}</label>-->
            <!--</div>-->
            <!--<hr align="center" width="300" color="#987cb9" SIZE="1" v-if="index < innerData.length - 1"/>-->
          <!--</div>-->
        <el-form label-position="left" class="demo-table-expand">
          <template v-for="(item, index) in innerData">
            <el-form-item style="margin:0 0 0 20px" :label="model + (index + 1)" v-for="(model, indexModel) in modelData" :key="index + '.' + indexModel">
              <span>{{item[indexModel]}}</span>
            </el-form-item>
            <hr align="center" width="100%" color="#987cb9" SIZE="1" v-if="index < innerData.length - 1"/>
          </template>
          <el-form-item style="margin:0 0 0 20px" label="" v-if="innerData.length === 0">
            <span>无</span>
          </el-form-item>
        </el-form>
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
import {Form, FormItem} from 'element-ui'
export default {
  name: 'JsonArrayViewer',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem
  },
  props: {
    title: String,
    showData: {
      type: String
    },
    modelData: {
      type: Array,
      validator: (value) => value.length > 0
    }
  },
  data () {
    return {
      innerData: this.showData ? JSON.parse(this.showData) : []
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
