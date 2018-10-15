import swal from 'sweetalert2'
import 'src/assets/js/pinyin_dict_firstletter'
import 'src/assets/js/pinyinUtil'
let upperAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const Dictionary = {
  dictData: {},
  inited: false,
  http: null,
  initData (httpPlugin) {
    if (this.inited) {
      return
    }
    this.http = httpPlugin
    this.http.get('/api/getDictionary').then(response => {
      if (response.data.success) {
        Dictionary.inited = true
        this.dictData = response.data.data
      }
    })
  },
  getItemList (key) {
    if (!this.dictData[key]) {
      this.dictData[key] = new Array()
    }
    return this.dictData[key]
  },
  generateNewItem (tableName, type, name, dataType, callback) {
    var underLineType = this.humpToUnderLine(type)
    var categoryName = `${tableName}-${underLineType}`
    var itemList = this.getItemList(categoryName)
    if (itemList.findIndex((item) => item.name === name.trim()) > -1) {
      swal({
        title: '添加字典数据失败!',
        text: `【${name}】已存在`,
        type: 'error',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: 'OK',
        buttonsStyling: false
      })
      return
    }
    var value = 1
    if (type === 'typeId') {
      let temp = pinyinUtil.getFirstLetter(name, false)
      value = temp.charAt(0)
      var i = 1
      while (i < temp.length && itemList.findIndex((item) => item.value === value + temp.charAt(i)) > -1) {
        i++
      }
      if (i < temp.length) {
        value += temp.charAt(i)
      } else {
        i = 0
        while (i < upperAlpha.length && itemList.findIndex((item) => item.value === value + upperAlpha[i]) > -1) {
          i++
        }
        if (i < upperAlpha.length) {
          value += upperAlpha[i]
        } else {
          swal({
            title: '添加字典数据失败!',
            text: '无法生成合适的产品系列代号',
            type: 'error',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'OK',
            buttonsStyling: false
          })
          return
        }
      }
    } else {
      if (itemList.length > 0) {
        value = itemList[itemList.length - 1].value + 1
      }
    }
    this.http.post(`/api/addDictionary/${dataType}/${underLineType}/${value}`, {name}).then(response => {
      if (response.data.success) {
        itemList.push({
          categoryName,
          columnName: underLineType,
          value,
          name
        })
        Dictionary.dictData[categoryName] = itemList
        swal({
          title: '添加字典数据成功!',
          text: `【${name}】已添加完成`,
          type: 'success',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'OK',
          buttonsStyling: false
        })
        if (callback) {
          callback(value)
        }
      } else {
        swal({
          title: '添加字典数据失败!',
          text: response.data.errMsg,
          type: 'error',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'OK',
          buttonsStyling: false
        })
      }
    })
  },
  getDictByType (tableName, type) {
    var underLineType = this.humpToUnderLine(type)
    return this.getItemList(`${tableName}-${underLineType}`)
  },
  humpToUnderLine (str) {
    return str.split('').map(function (word) {
      if (word.toLocaleUpperCase() === word) {
        return '_' + word.toLocaleLowerCase()
      } else {
        return word
      }
    }).join('')
  },
  getName (tableName, type, value) {
    var underLineType = this.humpToUnderLine(type)
    var item = this.getItemList(`${tableName}-${underLineType}`).find((item, index, arr) => {
      return item.value == value
    })
    if (item) {
      return item.name
    } else {
      return ''
    }
  },
  clear() {
    this.dictData = {}
    this.inited = false
  }
}
const DictionaryPlugin = {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          dictionary: Dictionary
        }
      }
    });

    Object.defineProperty(Vue.prototype, '$dictionary', {
      get () {
        return this.$root.dictionary
      }
    });
  }
}
export default DictionaryPlugin
