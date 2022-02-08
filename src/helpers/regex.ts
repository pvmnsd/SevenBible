const Regexps = {
  wordSplitter : /(?<!(?:<(?:m|S|f)>|<)[^<>]*)([^\s<>]+)/g
}

export const splitWords = (string: string) => string.replace(Regexps.wordSplitter, '<w>$&</w>')
