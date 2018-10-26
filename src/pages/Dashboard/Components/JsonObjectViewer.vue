<template>
  <div class="row">
    <div class="col-12">
      <card>
        <h6 slot="header" class="card-title" v-if="title">{{title}}</h6>
        <el-form label-position="left" class="demo-table-expand" inline>
          <el-form-item style="margin:0 0 0 20px" :label="item.name" v-for="(item, index) in innerData" :key="index">
            <span>{{item.value}}</span>
          </el-form-item>
          <el-form-item style="margin:0 0 0 20px" label="" v-if="innerData.length === 0">
            <span>无</span>
          </el-form-item>
        </el-form>
      </card>
    </div>
  </div>
</template>

<script>
import {Form, FormItem} from 'element-ui'
export default {
  name: 'JsonObjectViewer',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem
  },
  props: {
    title: String,
    showData: {
      type: String
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
</style>
