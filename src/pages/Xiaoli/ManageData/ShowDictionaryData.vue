<template>
  <div class="row" @keyup.alt.65="addData()" @keyup.alt.68="deleteSurplusPictures()">
    <div class="col-12">
      <card card-body-classes="table-full-width" no-footer-line>
        <h4 slot="header" class="card-title">{{dataTypeName}}数据一览</h4>
        <div style="display: inline; ">
          <div class="col-5" style="display: inline; float:left;">
            <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
              <fg-input>
                <el-select
                  class="select-primary mb-3"
                  style="width: 150px"
                  v-model="tableSelectValue"
                  placeholder="选择数据源">
                  <el-option
                    class="select-default"
                    v-for="item in tableSelectList"
                    :key="item.tableName"
                    :label="item.tableComment"
                    :value="item.tableName">
                  </el-option>
                </el-select>
              </fg-input>
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
            <el-table border
                      stripe
                      style="width: 100%;"
                      id="leftTable"
                      ref="leftTable"
                      :highlight-current-row="true"
                      @current-change="handleLeftCurrentChange"
                      :data="queriedLeftData">
              <el-table-column minWidth="150"
                               label="数据源">
                <span slot-scope="props">{{ props.row.tableComment }}</span>
              </el-table-column>
              <el-table-column minWidth="150"
                               label="字典名">
                <span slot-scope="props">{{ props.row.columnComment }}</span>
              </el-table-column>
            </el-table>

            <div class="">
              <p class="card-category">显示第{{total > 0 ? (from + 1) : 0}}-{{to}}条数据，共{{total}}条数据</p>
            </div>
            <n-pagination class="pagination-no-border"
                          v-model="pagination.currentPage"
                          :per-page="pagination.perPage"
                          :total="total">
            </n-pagination>
          </div>
          <div class="col-6" style="display: inline; float:right;">
            <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
              <fg-input style="justify-content: flex-end; width: 100%">
                <el-button class="select-primary mb-3 addButton" type="primary" icon="el-icon-plus" round >
                  新增(A)
                </el-button>
                <el-dropdown trigger="click">
                  <el-button type="warning" class="select-primary mb-3 addButton" icon="el-icon-back" round>
                    恢复字典<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>恢复当前字典</el-dropdown-item>
                    <el-dropdown-item>恢复全部字典</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </fg-input>
            </div>
            <el-table stripe
                      style="width: 100%;"
                      ref="rightTable"
                      :row-class-name="getRightTableRowClass"
                      id="rightTable"
                      :border="true"
                      :data="rightTableData">
              <el-table-column minWidth="150"
                               label="字典选项实际值">
                <span slot-scope="props">{{ props.row.value }}</span>
              </el-table-column>
              <el-table-column minWidth="150"
                               label="字典选项表示值">
                <span slot-scope="props">{{ props.row.name }}</span>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="col-5" style="float: left;">
            <!--<div class="">-->
              <!--<p class="card-category">显示第{{from + 1}}-{{to}}条数据，共{{total}}条数据</p>-->
            <!--</div>-->
            <!--<n-pagination class="pagination-no-border"-->
                          <!--v-model="pagination.currentPage"-->
                          <!--:per-page="pagination.perPage"-->
                          <!--:total="total">-->
            <!--</n-pagination>-->
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
  import {Table, TableColumn, Select, Option, Form, FormItem, Button, Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
  import {Pagination as NPagination} from 'src/components'
  import Fuse from 'fuse.js'
  import swal from 'sweetalert2'
  const NUMBER_REG = new RegExp('[1-9][0-9]*')
  export default {
    components: {
      NPagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Form.name]: Form,
      [FormItem.name]: FormItem,
      [Button.name]: Button,
      [Dropdown.name]: Dropdown,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem
    },
    name: 'ShowDictionaryData',
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
        let searchedData = this.leftTableData.filter(row => row.visible)
        return searchedData.length
      },
      dataTypeName() {
        return '字典'
      },
      queriedLeftData () {
        let filterData = this.leftTableData.filter(row => row.visible)
        let showDictionary = this
        let retData = filterData.slice(this.from, this.to)
        this.$nextTick(() => {
          if (retData.length > 0 && !this.currentRow) {
            showDictionary.$refs.leftTable.setCurrentRow(retData[0])
          }
        })
        return retData
      },
    },
    data () {
      return {
        pagination: {
          perPage: 10,
          currentPage: 1,
          total: 0
        },
        searchQuery: '',
        leftTableData: [],
        rightTableData: [],
        tableSelectList: [],
        tableSelectValue: '',
        currentRow: null,
        fuseSearch: null,
        tableHandler: null
      }
    },
    methods: {
      init () {
        let dictionaryData = this.$dictionary.getAllData()
        this.leftTableData = Object.keys(dictionaryData).map(key => {
          let [tableName, columnName] = key.split('-')
          let dataList = dictionaryData[key]
          return {
            tableName,
            columnName,
            key,
            changed: false,
            tableComment: dataList[0].tableComment || tableName,
            columnComment: dataList[0].columnComment || columnName,
            ordinalPosition: dataList[0].ordinalPosition,
            dataList,
            visible: true
          }
        })
        this.leftTableData.sort((el1, el2) => {
          let tableSortResult = el1.tableName.localeCompare(el2.tableName)
          if (tableSortResult === 0) {
            return el1.ordinalPosition - el2.ordinalPosition
          } else {
            return tableSortResult
          }
        })
        let page = this
        this.tableSelectList.push({
          tableName: '',
          tableComment: '所有数据'
        })
        this.leftTableData.map(row => {
          if (!page.tableSelectList.find(item => item.tableName === row.tableName)) {
            page.tableSelectList.push({
              tableName: row.tableName,
              tableComment: row.tableComment
            })
          }
        })
        this.fuseSearch = new Fuse(this.leftTableData, {keys: ['tableComment', 'columnComment'], threshold: 0.3})
      },
      handleLeftCurrentChange (currentRow) {
        this.currentRow = currentRow
        if (currentRow) {
          this.rightTableData = currentRow.dataList
          setTimeout(this.initDrag, 300)
        }
      },
      doSearch () {
        let searchResultKeys = []
        if (this.searchQuery.trim() !== '') {
          let result = this.fuseSearch.search(this.searchQuery)
          searchResultKeys = result.map(row => row.key)
        }
        let page = this
        this.leftTableData.map(row => {
          let searchMatch = searchResultKeys.length === 0 || searchResultKeys.indexOf(row.key) > -1
          let selectMatch = page.tableSelectValue === '' || page.tableSelectValue === row.tableName
          row.visible = searchMatch && selectMatch
        })
      },
      getRightTableRowClass({row}) {
        return `drag-${row.value}`
      },
      getRowKeyFunc (element) {
        let classNameArr = element.className.split(' ')
        let dragClassName = classNameArr.find(className => className.startsWith('drag-'))
        if (!dragClassName) {
          return null
        }
        let rowKey = dragClassName.slice(5)
        if (NUMBER_REG.test(rowKey)) {
          return parseInt(rowKey)
        } else {
          return rowKey
        }
      },
      dragRightTableFinish (_, dropRow) {
        this.rightTableData.map((rightRow, index) => rightRow.displayOrder = index + 1 && console.log(`after row:${rightRow.value}`))
        this.leftTableData.find(leftRow => leftRow.key === dropRow.categoryName).changed = true
      },
      initDrag () {
        this.$tableDrag.bindDrag(Array.prototype.slice.call(document.querySelectorAll('#rightTable tr.el-table__row')),
          this.rightTableData, 'value',
          {
            getRowIdFunc: this.getRowKeyFunc
            // onDrop: this.dragRightTableFinish
          }
        )
      },
      checkLogin (callback) {
        let app = this
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
      searchQuery (value) {
        this.doSearch()
      },
      tableSelectValue () {
        this.doSearch()
      }
    },
    props: {
      dataType: {
        type: Number,
        default: 3
      }
    }
  }
</script>
<style>
  .addButton {
    margin-left: 10px;
  }
  .row-changed {
    background-color: #dd6161!important;
  }
</style>



// WEBPACK FOOTER //
// src/pages/Dashboard/Tables/PaginatedTables.vue
