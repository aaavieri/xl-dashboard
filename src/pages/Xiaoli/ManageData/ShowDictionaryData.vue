<template>
  <div class="row" @keyup.alt.78="addData()" @keyup.alt.83="saveData()">
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
                <template slot-scope="props">
                  <span>{{ props.row.tableComment }}</span>
                  <strong v-if="props.row.changed" class="row-changed">modified!</strong>
                </template>
              </el-table-column>
              <el-table-column minWidth="150"
                               label="字典名">
                <template slot-scope="props">
                  <span>{{ props.row.columnComment }}</span>
                  <strong v-if="props.row.changed" class="row-changed">modified!</strong>
                </template>
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
          <div class="col-7" style="display: inline; float:right;">
            <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
              <fg-input style="justify-content: flex-end; width: 100%">
                <el-button class="select-primary mb-3 addButton" type="primary" icon="el-icon-plus" round @click="addData()">
                  新增(N)
                </el-button>
                <el-dropdown trigger="click" @command="handleRecover">
                  <el-button type="warning" class="select-primary mb-3 addButton" icon="el-icon-back" round>
                    恢复字典<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="1">恢复当前字典</el-dropdown-item>
                    <el-dropdown-item :command="2">恢复全部字典</el-dropdown-item>
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
              <el-table-column minWidth="70"
                               label="字典顺序">
                <template slot-scope="props">
                  <span :class="{'row-deleted': props.row.delFlag, 'row-added': !props.row.isInDb}">{{ props.row.editDisplayOrder }}</span>
                  <strong v-if="!props.row.isInDb" class="row-added2">new!</strong>
                  <strong v-else-if="props.row.displayOrder !== props.row.editDisplayOrder" class="row-changed2">changed!</strong>
                </template>
              </el-table-column>
              <el-table-column minWidth="100"
                               label="字典选项实际值">
                <template slot-scope="props">
                  <span :class="{'row-deleted': props.row.delFlag, 'row-added': !props.row.isInDb}">{{ props.row.value }}</span>
                  <strong v-if="!props.row.isInDb" class="row-added2">new!</strong>
                </template>
              </el-table-column>
              <el-table-column minWidth="150"
                               prop="name"
                               label="字典选项表示值">
                <template slot-scope="props">
                  <template v-if="props.row.editing === true">
                    <el-input :ref="'editInput' + props.row.value" class="edit-input" v-model="props.row.editName"/>
                    <!--<i class="el-icon-check edit-position" @click="editComplete(props.row)"></i>-->
                    <el-button type="success" icon="el-icon-check" size="mini" class="edit-button" circle @click.native="editComplete(props.row)"/>
                  </template>
                  <template v-else>
                    <span :class="{'row-deleted': props.row.delFlag, 'row-added': !props.row.isInDb}">{{ props.row.editName }}</span>
                    <strong v-if="!props.row.isInDb" class="row-added2">new!</strong>
                    <strong v-else-if="props.row.name !== props.row.editName" class="row-renamed">renamed!</strong>
                    <!--<i class="el-icon-edit edit-position" @click="editStart(props.row)"></i>-->
                    <template v-if="props.row.delFlag">
                      <el-button type="warning" icon="el-icon-back" size="mini" class="restore-button" circle @click.native="restoreItem(props.row)"/>
                    </template>
                    <template v-else>
                      <el-button type="danger" icon="el-icon-delete" size="mini" class="delete-button" circle @click.native="deleteItem(props.row, props.$index)"/>
                      <el-button type="primary" icon="el-icon-edit" size="mini" class="edit-button" circle @click.native="editStart(props.row)"/>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="col-10">
          </div>
          <div class="col-2">
            <el-button class="select-primary mb-3 addButton" type="success" icon="el-icon-message" round @click="saveData()">
              保存(S)
            </el-button>
          </div>
        </div>
      </card>
    </div>
    <notice-plugin title="使用说明" :width="500" :open="true">
      <div class="readme-div">
        <div>
          <span>1、左侧选择字典，右侧即显示该字典的所有选项。</span>
        </div>
        <div>
          <span>2、【拖动】右侧选项，即可调整选项顺序，调整后在【字典顺序】栏显示</span>
          <strong class="red" >changed!</strong>
          <span> 标签</span>
        </div>
        <div>
          <span>3、点击【新增】按钮，输入完成点输入框右侧的【钩】按钮，完成后该行显示</span>
          <strong class="green">绿色</strong>
          <span> 并添加</span>
          <strong class="green">new!</strong>
          <span> 标签</span>
        </div>
        <div>
          <span>4、点击右侧任意行的【笔】按钮，输入完成点输入框右侧的【钩】按钮修改显示名，完成后在【字典选项表示值】栏显示</span>
          <strong class="red">renamed!</strong>
          <span> 标签</span>
        </div>
        <div>
          <span>5、点击右侧任意行的【垃圾箱】按钮，即删除该行，该栏显示为</span>
          <strong class="red">红色</strong>
          <span> 并添加</span>
          <strong class="red">删除线</strong>
        </div>
        <div>
          <span>6、若执行【2-5】中任意操作，左侧表格中对应选中项会显示</span>
          <strong class="red">modified!</strong>
          <span> 标签</span>
        </div>
        <div>
          <span>7、点击右下角【保存】按钮，则保存所有更改，否则不会保存。</span>
        </div>
        <div>
          <span>8、点击【恢复数据】按钮，可选择是恢复</span>
          <strong class="red">当前字典</strong>
          <span> 的数据或</span>
          <strong class="red">所有字典</strong>
          <span> 数据。</span>
        </div>
      </div>
    </notice-plugin>
  </div>
</template>
<script>
  import {Table, TableColumn, Select, Option, Form, FormItem, Button, Dropdown, DropdownMenu, DropdownItem, Dialog} from 'element-ui'
  import NoticePlugin from '../../Dashboard/Components/NoticePlugin'
  import {Pagination as NPagination} from 'src/components'
  import Fuse from 'fuse.js'
  import swal from 'sweetalert2'
  const NUMBER_REG = new RegExp('[1-9][0-9]*')
  export default {
    components: {
      NoticePlugin,
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
      [DropdownItem.name]: DropdownItem,
      [Dialog.name]: Dialog,
      [NoticePlugin.name]: NoticePlugin
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
          let needInitDisplayOrder = false
          let {leftOrdinalPosition, leftTableComment, leftColumnComment} = {}
          let dataList = dictionaryData[key].map((data, index) => {
            let {value, name, delFlag, ordinalPosition, tableComment, columnComment} = data
            if (index === 0) {
              leftOrdinalPosition = ordinalPosition
              leftTableComment = tableComment
              leftColumnComment = columnComment
            }
            return {
              editing: false,
              name,
              value,
              displayOrder: index + 1,
              delFlag,
              editName: name,
              editDisplayOrder: index + 1,
              isInDb: true
            }
          })
          return {
            tableName,
            columnName,
            key,
            needInitDisplayOrder,
            changed: false,
            tableComment: leftTableComment || tableName,
            columnComment: leftColumnComment || columnName,
            ordinalPosition: leftOrdinalPosition || 1,
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
        this.tableSelectList.push({
          tableName: '',
          tableComment: '所有数据'
        })
        this.leftTableData.map(row => {
          if (!this.tableSelectList.find(item => item.tableName === row.tableName)) {
            this.tableSelectList.push({
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
          // setTimeout(this.initDrag, 300)
          this.$nextTick(this.initDrag)
        }
      },
      doSearch () {
        let searchResultKeys = []
        if (this.searchQuery.trim() !== '') {
          let result = this.fuseSearch.search(this.searchQuery)
          searchResultKeys = result.map(row => row.key)
        }
        this.leftTableData.map(row => {
          let searchMatch = searchResultKeys.length === 0 || searchResultKeys.indexOf(row.key) > -1
          let selectMatch = this.tableSelectValue === '' || this.tableSelectValue === row.tableName
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
      dragRightTableFinish () {
        this.rightTableData.map((rightRow, index) => rightRow.editDisplayOrder = index + 1)
        this.currentRow.changed = this.getChangeDataList(this.currentRow).length > 0
      },
      initDrag () {
        this.$tableDrag.bindDrag(Array.prototype.slice.call(document.querySelectorAll('#rightTable tr.el-table__row')),
          this.rightTableData, 'value',
          {
            getRowIdFunc: this.getRowKeyFunc,
            onDrop: this.dragRightTableFinish
          }
        )
      },
      handleRecover (command) {
        if (command === 1) {
          this.recoverNowDictionary()
        } else if (command === 2) {
          this.recoverAllDictionary()
        }
      },
      recoverNowDictionary () {
        this.recoverOneDictionary(this.currentRow)
        this.rightTableData = this.currentRow.dataList
      },
      recoverAllDictionary () {
        this.leftTableData.map(item => {
          this.recoverOneDictionary(item)
        })
        this.rightTableData = this.currentRow.dataList
      },
      recoverOneDictionary (leftRow) {
        leftRow.dataList = this.$dictionary.getItemList(leftRow.key).map(data => {
          let {value, name, delFlag} = data
          return {
            editing: false,
            name,
            value,
            displayOrder: index + 1,
            delFlag,
            editName: name,
            editDisplayOrder: index + 1,
            isInDb: true
          }
        })
        leftRow.changed = false
      },
      editStart (row) {
        row.editing = true
        this.$nextTick(() => {
          let editInputs = this.$refs[`editInput${row.value}`]
          editInputs.focus()
        })
      },
      editComplete (row) {
        if (row.editName.trim() === '') {
          let page = this
          this.$msgAlert.showSimpleErrorMsg('请输入选项').then(() => {
            setTimeout(() => {
              page.$refs[`editInput${row.value}`].focus()
            }, 300)
          })
          return
        }
        row.editing = false
        let type = this.$dictionary.underLineToHump(this.currentRow.columnName)
        if (type === 'typeId' && !row.isInDb) {
          let {value} = this.$dictionary.generateNewItemWithoutSave(this.currentRow.tableName, type, row.editName)
          row.value = value
        }
        this.currentRow.changed = this.getChangeDataList(this.currentRow).length > 0
        // setTimeout(this.initDrag, 300)
        this.$nextTick(this.initDrag)
      },
      addData () {
        let newItem = {
          editing: true,
          name: '',
          displayOrder: this.rightTableData.length + 1,
          delFlag: false,
          editName: '',
          editDisplayOrder: this.rightTableData.length + 1,
          isInDb: false
        }
        let type = this.$dictionary.underLineToHump(this.currentRow.columnName)
        if (type !== 'typeId') {
          newItem.value = Math.max(...(this.rightTableData.map(item => item.value))) + 1
        } else {
          newItem.value = ''
        }
        this.rightTableData.push(newItem)
        this.currentRow.changed = this.getChangeDataList(this.currentRow).length > 0
        this.$nextTick(() => {
          let editInputs = this.$refs[`editInput${newItem.value}`]
          editInputs.focus()
        })
      },
      deleteItem (row, index) {
        row.delFlag = true
        if (!row.isInDb) {
          this.rightTableData.splice(index, 1)
        }
        this.currentRow.changed = this.getChangeDataList(this.currentRow).length > 0
      },
      restoreItem (row) {
        row.delFlag = false
      },
      getChangeDataList (leftRow) {
        return leftRow.dataList.filter(rightRow => {
          return (rightRow.name !== rightRow.editName)
          || (rightRow.displayOrder !== rightRow.editDisplayOrder)
          || (rightRow.delFlag)
          || (!rightRow.isInDb)
        })
      },
      saveData () {
        let validInput = false
        let page = this
        let needSaveData = this.leftTableData.filter(row => row.changed)
        needSaveData.map(row => {
          let editingItem = row.dataList.find(item => item.editing)
          if (!validInput && editingItem) {
            validInput = true
            this.$msgAlert.showSimpleErrorMsg('尚有未完成的输入，请输入后再保存').then(() => {
              if (page.currentRow.key !== row.key) {
                page.$refs.leftTable.setCurrentRow(row)
              }
              setTimeout(() => {
                page.$refs[`editInput${editingItem.value}`].focus()
              }, 300)
            })
          }
          if (row.needInitDisplayOrder) {
            row.updateDataList = row.dataList
          } else {
            row.updateDataList = this.getChangeDataList(row)
          }
        })
        if (validInput || needSaveData.length === 0) {
          return
        }
        this.$http.post('/api/updateDictionary', {needSaveData}).then(response => {
          if (!response.data.success) {
            page.$msgAlert.showSimpleErrorMsg(response.data.errMsg)
          } else {
            page.$msgAlert.showSimpleSuccessMsg('保存成功')
            page.afterSave(needSaveData)
          }
        })
      },
      afterSave (savedData) {
        savedData.map(leftItem => {
          leftItem.changed = false
          leftItem.needInitDisplayOrder = false
          let dictionaryList = this.$dictionary.getItemList(leftItem.key)
          leftItem.updateDataList.map(rightItem => {
            rightItem.displayOrder = rightItem.editDisplayOrder
            rightItem.name = rightItem.editName
            if (rightItem.delFlag) {
              let index = leftItem.dataList.findIndex(item => item.value === rightItem.value)
              console.log(leftItem.dataList)
              leftItem.dataList.splice(index, 1)
              console.log(leftItem.dataList)
              index = dictionaryList.findIndex(item => item.value === rightItem.value)
              dictionaryList.splice(index, 1)
            } else if (!rightItem.isInDb) {
              rightItem.isInDb = true
              let addItem = {}
              if (dictionaryList.length > 0) {
                Object.assign(addItem, dictionaryList[0])
                addItem.name = rightItem.name
                addItem.value = rightItem.value
                addItem.displayOrder = rightItem.displayOrder
              } else {
                Object.assign(addItem, leftItem)
                Object.assign(addItem, rightItem)
              }
              dictionaryList.push(addItem)
            } else {
              let updateItem = dictionaryList.find(item => item.value === rightItem.value)
              updateItem.name = rightItem.name
              updateItem.displayOrder = rightItem.displayOrder
            }
          })
          leftItem.updateDataList = []
          dictionaryList.sort((item1, item2) => {
            let displaySort = item1.displayOrder - item2.displayOrder
            return displaySort !== 0 ? displaySort : (item1.value - item2.value)
          })
        })
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
     color: #dd6161;
     font-size: 1px;
     font-style:italic;
     position:absolute;
     right:5px;
     bottom:0px;
  }
  .row-deleted {
    color: #dd6161;
    text-decoration: line-through
  }
  .row-added {
    color: #1beb11;
  }
  .row-added2 {
    color: #dd6161;
    font-size: 1px;
    font-style:italic;
    position:absolute;
    margin-left: 5px;
    top:0px;
  }
  .row-changed2 {
    color: #dd6161;
    font-size: 1px;
    font-style:italic;
    position:absolute;
    margin-left: 5px;
    top:0px;
  }
  .row-renamed {
    color: #dd6161;
    font-size: 1px;
    font-style:italic;
    position:absolute;
    margin-left: 5px;
    top:0px;
  }
  .edit-button {
    float: right;
  }
  .restore-button {
    float: right;
  }
  .delete-button {
    float: right;
    position: relative;
    left: 5px;
  }
  .edit-input {
    width: calc(100% - 70px);
  }
  .readme-div {
    width: 100%
  }
  .readme-div div {
    margin-bottom: 5px;
  }

  .readme-div strong {
    font-style: italic;
  }

  .readme-div strong.red {
    color: #dd6161;
  }

  .readme-div strong.green {
    color: #1beb11;
  }
</style>



// WEBPACK FOOTER //
// src/pages/Dashboard/Tables/PaginatedTables.vue
