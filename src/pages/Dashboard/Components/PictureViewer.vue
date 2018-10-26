<template>
  <div class="row">
    <div class="col-12">
      <card>
        <h6 slot="header" class="card-title" v-if="title">{{title}}</h6>
        <ul class="el-upload-list el-upload-list--picture-card" v-if="showData.length > 0">
          <li v-for="(file, index) in showData"
              class="el-upload-list__item is-success"
              :key="index"
              :style="{
                height: `${148 / (1 - liFooterHeightRate)}px`,
                borderWidth: '0px'
              }">
            <img :src="file.url" alt="" class="el-upload-list__item-thumbnail" :style="{
              height: `${(1 - liFooterHeightRate) * 100}%`,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#c0ccda',
              borderRadius: '6px'
            }"/>
            <!--<a class="el-upload-list__item-name" @click="handleClick(file)">-->
              <!--<i class="el-icon-document"></i>{{file.name}}-->
            <!--</a>-->
            <span class="el-upload-list__item-actions" :style="{
              height: `${(1 - liFooterHeightRate) * 100}%`
            }">
              <!--<span-->
                <!--class="el-upload-list__item-preview"-->
                <!--@click="handlePreview(file)"-->
              <!--&gt;-->
                <!--<i class="el-icon-zoom-in"></i>-->
              <!--</span>-->
              <slot name="actions" :data="{file, index, fileList: showData}">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <slot name="other-actions" :data="{file, index, fileList: showData}" :style="{height: `${liFooterHeightRate * 100}%`}"/>
              </slot>
            </span>
            <slot name="li-footer" :data="{file, index, fileList: showData}"/>
          </li>
        </ul>
        <slot name="after">
          <el-form label-position="left" class="demo-table-expand" inline v-if="showData.length === 0">
            <el-form-item style="margin:0 0 0 20px" label="">
              <span>无</span>
            </el-form-item>
          </el-form>
        </slot>
      </card>
    </div>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" v-if="!onPreview">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {Form, FormItem, Dialog} from 'element-ui'
export default {
  name: 'PictureViewer',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Dialog.name]: Dialog
  },
  props: {
    title: String,
    showData: {
      type: Array,
      default: () => []
    },
    onPreview: Function,
    liFooterHeightRate: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value < 1
    }
  },
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handlePreview (file) {
      (this.onPreview || this.defaultPreview)(file)
    },
    defaultPreview (file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    }
  }
}
</script>

<style scoped>
</style>
