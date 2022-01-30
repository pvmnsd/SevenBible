export default async (/* { app, router, Vue ... } */) => {

  String.prototype.format = function () {
    let idx = -1
    return this.replace(/%s/g, (match) => {
      idx++
      return arguments[idx] ? arguments[idx] : match
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
  Array.prototype.insert = function (value) {
    let index
    for (let i = 0, max = 0; i < this.length; i++){
      let el = this[i]
      if (el > max && el < value) {
        max = el
        index = i + 1
      }
    }
    this.splice(index, 0, value)
  }


}
