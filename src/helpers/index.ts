import {inject, InjectionKey} from "vue";
import {BookNumbers} from "src-e/types/bookNumbers";

export const myRef = (value: any) => ({value})

export const getBookCategory = (bookNumber: BookNumbers) => {
  return (bookNumber <= 50) ? 'torah'
    : (bookNumber <= 160 || bookNumber === 190) ? 'poetry'
      : (bookNumber >= 220 && bookNumber <= 260) ? 'major-prophets'
        : (bookNumber >= 290 && bookNumber <= 460) ? 'minor-prophets'
          : (bookNumber >= 470 && bookNumber <= 500) ? 'gospels'
            : (bookNumber === 510) ? 'acts'
              : (bookNumber >= 520 && bookNumber <= 720) ? 'epistles'
                : (bookNumber === 730) ? 'revelations'
                  : 'non-canonical'
}

export const convertVerses = (verses: number[]) => {
  let res = verses[0].toString()
  for (let i = 1; i < verses.length; i++) {
    const verse = verses[i]
    if (verse - 1 !== verses[i - 1])
      res += `,${verse}`
    else {
      let lastIndex: number = 0
      for (let j = i; j < verses.length; j++) {
        if (j === verses.length - 1) {
          lastIndex = j
          break
        } else if (verses[j + 1] !== verses[j] + 1) {
          lastIndex = j
          break
        }
      }
      res += `-${verses[lastIndex]}`
      i = lastIndex
    }

  }
  return res
}

export const clearTags = (html: string) => html.replace(/(<[Smfnh]>.+?<\/[Smfnh]>|<[^>]+>)/g, "")

export const cropString = (string: string, length: number) => string.length > length ? string.slice(0, length) + '...' : string

export const injectStrict = <T>(key: InjectionKey<T>, fallback?: T) => {
  const resolved = inject(key, fallback)
  if (resolved === null || resolved === undefined)
    throw new Error(`Could not resolve ${key.description}`)
  return resolved
}
