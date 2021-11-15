export default text => {
  return text?.replace(/(?<!(?:<(?:m|S|f)>|<)[^<>]*)([^\s<>]+)/g, '<w>$&</w>')
}
