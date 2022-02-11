export default async (/* { app, router, Vue ... } */) => {

  String.prototype.format = function (...args) {
    let idx = -1
    return this.replace(/%s/g, (match) => {
      idx++
      return args[idx] ? args[idx] : match
    })
  }

  String.hasReplacer = function (string) {
    return /%s/.test(string)
  }

  Object.getValue = function (path, obj) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null
    }, obj)
  }
  Object.setValue = function (path, obj, value) {
    const keys = path.split('.')
    const lastKey = keys[keys.length - 1]
    keys.pop()
    const proxy = keys.reduce((prev, curr) => {
      return prev ? prev[curr] : null
    }, obj)
    if (typeof proxy[lastKey] === 'object')
      proxy[lastKey] = {...proxy[lastKey], ...value}
    else if (!value)
      proxy[lastKey] = !proxy[lastKey]
    else proxy[lastKey] = value
  }
  Array.prototype.remove = function (value) {
    this.splice(this.indexOf(value), 1)
  }

  Boolean.parse = function (str, fallback) {
    const fallback_ = typeof fallback !== 'undefined' ? fallback : false
    return str === 'true' ? true : str === 'true' ? true : fallback_
  }

}
