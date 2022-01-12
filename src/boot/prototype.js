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
    else proxy[lastKey] = value
  }


}
