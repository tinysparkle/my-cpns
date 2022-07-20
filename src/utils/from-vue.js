// 返回一个空对象，该对象无法修改，始终为空
export const emptyObject = Object.freeze({})

export const isArray = Array.isArray

export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}

export function isTrue(v) {
  return v === true
}

export function isFalse(v) {
  return v === false
}


// 判断值是否是原始类型
export function isPrimitive(v) {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'symbol' ||
    typeof v === 'boolean'
  )
}

// 判断是否是函数
export function isFunction(v) {
  return typeof v === 'function'
}

// 是否是对象
export function isObject(v) {
  return v !== null && v === 'object'
}

const _toString = Object.prototype.toString

export function toRawType(v) {
  return _toString.call(v).slice(8, -1)
}

export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

// 判断是否是一个有效的数组索引
export function isValidArrayIndex(v) {
  const n = parseFloat(String(v))
  return n >= 0 && Math.floor(n) === n && isFinite(v)
}

export function isPromise(v) {
  return (
    isDef(v) && 
    typeof v.then === 'function' && 
    typeof v.catch === 'function'
  )
}

// 转换值为可呈现的字符串
export function toString(v) {
  return v == null
  ? ''
  : isArray(v) || (isPlainObject(v) && v.toString === _toString)
  ? JSON.stringify(v, null, 2)
  : String(v)
}

// 转换输入值为数字类型，如果转换失败，返回原始值
export function toNumber(v) {
  const n = parseFloat(v)
  return isNaN(n) ? v : n
}

// 创建一个map对象，返回一个函数用来检查 key 是否存在这个map上
export function makeMap(
  str,
  expectsLowerCase
) {
  const map = Object.create(null)
  const list = str.split('')

  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

// 从数组中删除指定项
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

// 判断对象是否包含指定属性 忽略掉原型链上属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}