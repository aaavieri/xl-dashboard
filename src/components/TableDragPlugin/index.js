let tableDrag = {
  bindDrag (elements, tableData, rowIdKey = 'id', callFuncs = {getRowIdFunc: defaultGetRowIdFunc}) {
    return new TableDragHandler(elements, tableData, callFuncs, rowIdKey)
  }
}

function defaultGetRowIdFunc (element) {
  let classNameArr = element.className.split(' ')
  let dragClassName = classNameArr.find(className => className.startsWith('drag-'))
  if (!dragClassName) {
    return null
  }
  let [, rowId] = dragClassName.split('-')
  return parseInt(rowId)
}

function TableDragHandler (elements, tableData, callFuncs, rowIdKey) {
  this.tableData = tableData
  this.elements = elements
  this.callFuncs = callFuncs
  this.draggingRow = null
  let tableDragHandler = this
  this.rowDragHandlers = elements.map((element, index) => {
    element.draggable = true
    let rowId = callFuncs.getRowIdFunc(element, index)
    let rowData = tableData.find(row => row[rowIdKey] === rowId)
    let rowDragHandler = new RowDragHandler(rowId, rowData, tableDragHandler)
    rowDragHandler.bindElement(element)
    return rowDragHandler
  })
  this.acceptDrop = (dropRow) => {
    let draggingRow = tableDragHandler.draggingRow
    let dropRowIndex = tableData.indexOf(tableData.find(row => row[rowIdKey] === dropRow.rowId))
    let draggingRowIndex = tableData.indexOf(tableData.find(row => row[rowIdKey] === draggingRow.rowId))
    console.log(`drag row:${tableDragHandler.draggingRow.rowId}`)
    console.log(`drop row:${dropRow.rowId}`)
    if (dropRowIndex < draggingRowIndex) {
      tableDragHandler.tableData.splice(draggingRowIndex, 1)
      tableDragHandler.tableData.splice(dropRowIndex, 0, draggingRow.rowData)
    } else if (dropRowIndex > draggingRowIndex) {
      tableDragHandler.tableData.splice(dropRowIndex + 1, 0, draggingRow.rowData)
      tableDragHandler.tableData.splice(draggingRowIndex, 1)
    }
    tableDragHandler.draggingRow = null
  }
  return this
}
function RowDragHandler (rowId, rowData, tableDragHandler) {
  let rowDragHandler = this
  this.rowId = rowId
  this.rowData = rowData
  this.onSelectStart = () => false
  this.onDragStart = (ev) => {
    if (tableDragHandler.draggingRow) {
      return false
    }
    ev.dataTransfer.effectAllowed = 'move'
    console.log(`start row:${rowDragHandler.rowId}`)
    ev.dataTransfer.setData('text', ev.target.innerHTML)
    ev.dataTransfer.setDragImage(ev.target, 0, 0)
    tableDragHandler.draggingRow = rowDragHandler
    if (tableDragHandler.callFuncs.onDragStart) {
      tableDragHandler.callFuncs.onDragStart(ev, rowDragHandler.rowData)
    }
    return true
  }
  this.onDragOver = (ev) => {
    ev.preventDefault()
    if (tableDragHandler.callFuncs.onDragOver) {
      tableDragHandler.callFuncs.onDragOver(ev, rowDragHandler.rowData, tableDragHandler.draggingRow.rowData)
    }
    return true
  }
  this.onDragEnd = (ev) => {
    let draggingRow = tableDragHandler.callFuncs.draggingRow
    if (tableDragHandler.callFuncs.draggingRow) {
      tableDragHandler.callFuncs.draggingRow = null
    }
    if (tableDragHandler.onDragEnd) {
      tableDragHandler.onDragEnd(ev, rowDragHandler.rowData, draggingRow ? draggingRow.rowData : null)
    }
    return true
  }
  this.onDragEnter = () => true
  this.onDrop = (ev) => {
    let draggingRow = tableDragHandler.draggingRow
    if (!draggingRow) {
      return false
    }
    tableDragHandler.acceptDrop(rowDragHandler)
    if (tableDragHandler.callFuncs.onDrop) {
      tableDragHandler.callFuncs.onDrop(ev, rowDragHandler.rowData, draggingRow.rowData)
    }
    return false
  }
  this.bindElement = (element) => {
    element.onselectstart = rowDragHandler.onSelectStart
    element.ondragstart = rowDragHandler.onDragStart
    element.ondragend = rowDragHandler.onDragEnd
    element.ondragover = rowDragHandler.onDragOver
    element.ondragenter = rowDragHandler.onDragEnter
    element.ondrop = rowDragHandler.onDrop
  }
}
const DragPlugin = {
  install (Vue) {
    tableDrag.$vue = Vue
    Vue.mixin({
      data () {
        return {
          tableDrag
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$tableDrag', {
      get () {
        return this.$root.tableDrag
      }
    })
  }
}

export default DragPlugin
