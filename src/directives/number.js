const number = {
  bind(el, binding, vnode) {
    let fn = vnode.child.handleInput
      vnode.child.handleInput = function handleInput(e) {
        let numberBinding = vnode.child.numberBinding || {}
        let val = e.target.value
        
        if (val != null && !Number.isNaN(val)) {    // 将句号转为小数点
          val = String(val).replace(/。/g, '.')
        }
        let reg1 = /^[-+]?\d*\.?\d*/
        let reg2 = /^([-+]?)0+(\d+)/
        
        if (numberBinding.value === 'positive') {   // 只允许输入正数和0
          reg1 = /^[+]?\d*\.?\d*/
          if (val < 0) {
            val = ''
          }
        } else if (numberBinding.value === 'negative') {    // 只允许输入负数和0
          reg1 = /^[-0]\d*\.?\d*/
          if (val > 0) {
              val = ''
          }
        } else if (numberBinding.value === 'noNegativeInteger') {   // 只允许输入正整数（包括0）
          reg1 = /^[+]?\d*/
          if (val < 0) {
              val = ''
          }
        } else if (numberBinding.value === 'positiveInt') {         // 只允许输入正整数（不包括0）
          reg1 = /^[+]?\d*/
          if (val <= 0) {
              val = ''
          }
        } else if (numberBinding.value === 'decimalTwo') {          // 只允许输入两位小数 (包括负数和正数)
          reg1 = /^[-+]?\d*\.?\d{0,2}/
        } else if (numberBinding.value === 'positiveDecimalTwo') {          // 只允许输入正数两位小数
          reg1 = /^[+]?\d*\.?\d{0,2}/
        } else if (numberBinding.value === 'integer') {             // 只允许输入整数（包括正整数和负整数）
          reg1 = /^[-+]?\d*/
        } else if (numberBinding.value === 'numberTen') {
          reg1 = /^[+]?\d{1,10}/
        } else if (numberBinding.value === 'positiveNoZero') {   // 只允许输入正数(不包括0)
          reg1 = /^[+]?\d*\.?\d*/
          if (val <= 0) {
              val = ''
          }
        }
        val = (reg1.exec(val) || [''])[0]
        e.target.value = val.replace(reg2, '$1$2')
        vnode.child.isOnComposition = false
        fn(e)
    }
  },
  componentUpdated(el, binding, vnode) { // 组件更新后设置binding，其他钩子函数中不能获取到最新的binding
      vnode.child.numberBinding = binding
  },
}

export default number