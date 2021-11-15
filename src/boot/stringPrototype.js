
export default async (/* { app, router, Vue ... } */) => {
  String.prototype.format = function() {
    let idx = -1
    return this.replace(/%s/g, (match) => {
      idx++
      return arguments[idx] ? arguments[idx] : match
    })
  }
  String.hasReplacer = function (string){
    return /%s/.test(string)
  }
}
