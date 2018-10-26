import swal from 'sweetalert2'

let msgAlert = {
  showSimpleSuccessMsg: (msg) => {
    swal({
      title: '操作成功!',
      text: msg,
      type: 'success',
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'OK',
      buttonsStyling: false
    })
  },
  showSimpleErrorMsg: (msg) => {
    swal({
      title: '操作失败!',
      text: msg,
      type: 'error',
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'OK',
      buttonsStyling: false
    })
  }
}

const MsgAlertPlugin = {
  install (Vue) {
    msgAlert.$vue = Vue
    Vue.mixin({
      data () {
        return {
          msgAlert
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$msgAlert', {
      get () {
        return this.$root.msgAlert
      }
    })
  }
}

export default MsgAlertPlugin
