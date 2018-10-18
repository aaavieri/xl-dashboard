<template>
  <div class="row" @keyup.alt.65="addData()">
    <div class="col-12">
      <card card-body-classes="table-full-width" no-footer-line>
        <h4 slot="header" class="card-title">{{dataTypeName}}数据一览</h4>
        <div>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <div>
              <el-select
                class="select-primary mb-3"
                style="width: 200px"
                v-model="pagination.perPage"
                placeholder="Per page">
                <el-option
                  class="select-default"
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <!--<n-button type="primary" round class="select-primary mb-3 addButton">-->
                <!--<i slot="label" class="now-ui-icons ui-1_simple-add"></i>-->
                <!--新增-->
              <!--</n-button>-->
              <el-button class="select-primary mb-3 addButton" type="primary" icon="el-icon-plus" round @click="addData()">
                新增(A)
              </el-button>
            </div>
            <fg-input>
              <el-input type="search" ref="searchInput"
                        class="mb-3"
                        clearable
                        prefix-icon="el-icon-search"
                        style="width: 200px"
                        placeholder="检索"
                        v-model="searchQuery"
                        aria-controls="datatables">
              </el-input>
            </fg-input>

          </div>
          <el-table stripe
                    style="width: 100%;"
                    :data="queriedData()">
            <el-table-column type="expand" fixed="left" @click="alert(1)">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item :label="column.label" v-for="column in tableColumns" :key="column.columnName" v-if="column.listDisplayPosition == 1">
                    <span v-if="column.dataType == 'dictionary'">{{ getDictionLabel(column.columnName, props.row[column.columnName])}}</span>
                    <span v-else>{{ props.row[column.columnName] }}</span>
                  </el-form-item>
                </el-form>
                <!--<nav class="menu menu&#45;&#45;tsula">-->
                  <!--<div class="menu__item" v-for="column in tableColumns" :key="column.columnName" v-if="column.listDisplayPosition == 1">-->
                    <!--<span class="menu__item-name">{{column.label}}</span>-->
                    <!--<span class="menu__item-label">{{ props.row[column.columnName] }}</span>-->
                  <!--</div>-->
                <!--</nav>-->
              </template>
            </el-table-column>
            <el-table-column v-for="column in tableColumns"
                             v-if="column.listDisplayPosition == 0"
                             minWidth="150"
                             :key="column.columnName"
                             :fixed="column.fixedValue"
                             :label="column.label">
              <template slot-scope="props">
                <span v-if="column.dataType == 'dictionary'">{{ getDictionLabel(column.columnName, props.row[column.columnName])}}</span>
                <span v-else>{{ props.row[column.columnName] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :min-width="135"
              fixed="right"
              label="操作">
              <div slot-scope="props" class="table-actions">
                <n-button @click.native="handleCopy(props.$index, props.row)"
                          class="like"
                          type="info"
                          size="sm" round icon>
                  <i class="fa fa-copy"></i>
                </n-button>
                <n-button @click.native="handleEdit(props.$index, props.row)"
                          class="edit"
                          type="warning"
                          size="sm" round icon>
                  <i class="fa fa-edit"></i>
                </n-button>
                <n-button @click.native="handleDelete(props.$index, props.row)"
                          class="remove"
                          type="danger"
                          size="sm" round icon>
                  <i class="fa fa-times"></i>
                </n-button>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="">
            <p class="card-category">显示第{{from + 1}}-{{to}}条数据，共{{total}}条数据</p>
          </div>
          <n-pagination class="pagination-no-border"
                        v-model="pagination.currentPage"
                        :per-page="pagination.perPage"
                        :total="total">
          </n-pagination>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
  import {Table, TableColumn, Select, Option, Form, FormItem, Button} from 'element-ui'
  import {Pagination as NPagination} from 'src/components'
  import axios from 'axios'
  // import users from './users'
  import dummyData from './dummyData'
  import Fuse from 'fuse.js'
  import swal from 'sweetalert2'

  export default {
    components: {
      NPagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Form.name]: Form,
      [FormItem.name]: FormItem,
      [Button.name]: Button
    },
    name: 'ShowData',
    computed: {
      /***
       * Returns a page from the searched data or the whole data. Search is performed in the watch section below
       */
      to () {
        let highBound = this.from + this.pagination.perPage
        if (this.total < highBound) {
          highBound = this.total
        }
        return highBound
      },
      from () {
        return this.pagination.perPage * (this.pagination.currentPage - 1)
      },
      total () {
        return this.searchedData.length > 0 ? this.searchedData.length : this.tableData.length;
      },
      dataTypeName() {
        switch (this.dataType) {
          case 2:
            return '大健康'
          default:
            return '医疗版'
        }
      }
    },
    data () {
      return {
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [5, 10, 25, 50],
          total: 0
        },
        searchQuery: '',
        propsToSearch: ['name', 'serial'],
        tableColumns: [],
        tableData: [],
        originTableData: [],
        searchedData: [],
        fuseSearch: null,
        contentStyle: {
          width: '100%'
        }
      }
    },
    methods: {
      addData () {
        this.$router.push({name: 'EditMedicalData', params: {dataType: this.dataType, actionType: 1}})
      },
      handleCopy (index, row) {
        swal({
          title: '复制数据?',
          text: `你将【${row.name}】复制为一条新数据!`,
          type: 'question',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: '复制',
          cancelButtonText: '取消',
          buttonsStyling: false
        }).then((result) => {
          if(result.value){
            var copyRow = Object.assign(row)
            copyRow.serial = null
            this.$router.push({name: 'EditMedicalData', params: {dataType: this.dataType, actionType: 1, rowData: copyRow}})
          }
        });
      },
      handleEdit (index, row) {
        swal({
          title: '前往修改?',
          text: `你将修改【${row.name}】!`,
          type: 'question',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: '修改',
          cancelButtonText: '取消',
          buttonsStyling: false
        }).then((result) => {
          if(result.value){
            this.$router.push({name: 'EditMedicalData', params: {dataType: this.dataType, actionType: 2, rowData: row}})
          }
        });
      },
      handleDelete (index, row) {
        swal({
          title: '确定删除?',
          text: `你将删除【${row.name}】!`,
          type: 'question',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: '确定删除!',
          cancelButtonText: '取消',
          buttonsStyling: false
        }).then((result) => {
          if(result.value){
            this.deleteRow(row);
            // swal({
            //   title: 'Deleted!',
            //   text: `You deleted ${row.name}`,
            //   type: 'success',
            //   confirmButtonClass: 'btn btn-success btn-fill',
            //   buttonsStyling: false
            // })
          }
        });
      },
      deleteRow(row){
        let showData = this
        this.$http.post(`/api/deleteRecord/${this.dataType}/${row.serial}`, {rowVersion: row.rowVersion}).then(response => {
          if (response.data.success) {
            showData.searchTableData(() => {
              swal({
                title: '删除成功!',
                text: `成功删除 ${row.name}`,
                type: 'success',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              })
            })
          } else {
            swal({
              title: '删除失败!',
              text: response.data.errMsg,
              type: 'error',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            })
          }
        })
      },
      queriedData () {
        let result = this.tableData;
        if(this.searchedData.length > 0){
          result = this.searchedData;
        }
        return result.slice(this.from, this.to)
      },
      init() {
        this.getData()
      },
      initColumnData(data) {
        this.tableColumns = data.filter(item => item.listDisplay)
          .sort((item1, item2) => item1.order - item2.order)
          .map(item => {
            switch (item.fixed) {
              case 1:
                item.fixedValue = 'left'
                break
              case 2:
                item.fixedValue = 'right'
                break
              default:
                item.fixedValue = null
            }
            return item
          })
      },
      searchTableData(callback) {
        let showData = this
        this.$http.get(`/api/getDataByType/${this.dataType}`).then(response => {
          if (callback) {
            callback()
          }
          if (response.data.success) {
            showData.initTableData(response.data.data)
          } else {
            swal({
              title: '数据检索失败!',
              text: response.data.errMsg,
              type: 'error',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            })
          }
        })
      },
      initTableData(data) {
        this.tableData = data
        this.fuseSearch = new Fuse(this.tableData, {keys: ['name', 'serial'], threshold: 0.3})
        let result = this.tableData
        if (this.searchQuery.trim() !== '') {
          result = this.fuseSearch.search(this.searchQuery)
        }
        this.searchedData = result;
      },
      getData() {
        let showData = this
        axios.all([this.$http.get(`/api/getColumnInfo/${this.dataType}`), this.$http.get(`/api/getDataByType/${this.dataType}`)])
          .then(axios.spread(function (columnInfo, tableData) {
            var hasErr = !columnInfo.data.success || !tableData.data.success
            if (!columnInfo.data.success) {
              swal({
                title: '请求错误!',
                text: columnInfo.data.errMsg,
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
            } else if (!tableData.data.success) {
              swal({
                title: '请求错误!',
                text: tableData.data.errMsg,
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
            }
            if (!hasErr) {
              showData.initColumnData(columnInfo.data.data)
              showData.initTableData(tableData.data.data)
            }
            showData.$refs.searchInput.focus()
          }))
      },
      checkLogin (callback) {
        var app = this
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
      doSearch (value) {
        let result = this.tableData;
        if (value !== '') {
          result = this.fuseSearch.search(this.searchQuery)
        }
        this.searchedData = result
      },
      getDictionLabel(type, value) {
        return this.$dictionary.getName(this.getTableName(), type, value)
      },
      getTableName() {
        var tableName = ''
        switch (this.dataType) {
          case 1:
            tableName = 't_medical'
            break
          case 2:
            tableName = 't_healthy'
            break
          default:
            tableName = 't_medical'
        }
        return tableName
      }
    },
    mounted () {
      this.checkLogin(this.init)
      // Fuse search initialization.
    },
    watch: {
      /**
       * Searches through the table data by a given query.
       * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
       * @param value of the query
       */
      searchQuery(value){
        this.doSearch(value)
      }
    },
    props: {
      dataType: {
        type: Number,
        default: 1
      }
    }
  }
</script>
<style>
  .addButton {
    margin-left: 10px;
  }
</style>



// WEBPACK FOOTER //
// src/pages/Dashboard/Tables/PaginatedTables.vue
