const escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, '\\$&')
}

export const highlightSearch = function(message, keyword, flags = 'gi') {
  let newKeyword = keyword
  let regexWord = ''
  if (typeof keyword === 'string') {
    regexWord = escapeRegExp(newKeyword)
  } else if (Array.isArray(keyword) && keyword.length > 0) {
    regexWord = keyword.map(k => escapeRegExp(k)).join('|')
  }

  const match = new RegExp(`(${regexWord})`, flags)
  const testMath = match.test(message)
  if (testMath) {
    const replaced = message.replace(match, `:;{{:;\$&:;}}:;`)
    const matchAgain = new RegExp(`:;{{:;(${regexWord}):;}}:;`, flags)
    const restoreReplaced = replaced.replace(matchAgain, `<mark>\$1</mark>`)
    return restoreReplaced
  }
  return message
}
