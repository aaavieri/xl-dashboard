<template>
  <div class="row">
    <div class="col-12">
      <card>
        <h6 slot="header" class="card-title" v-if="title">{{title}}</h6>
        <el-form label-position="left" class="demo-table-expand" inline>
          <el-form-item style="margin:0 0 0 20px" :label="column.label" v-for="(column, index) in spanColumns" :key="index">
            <span>{{showData[column.columnName]}}</span>
          </el-form-item>
          <el-form-item style="margin:0 0 0 20px" label="" v-if="spanColumns.length === 0">
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
  name: 'SpanInfoViewer',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem
  },
  props: {
    title: String,
    showData: {
      type: Object,
      default: () => {}
    },
    spanColumns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
