export const insertVerse = (selectedVerses: number[], verse: number) => {
  let index = 0
  for (let i = 0, max = 0; i < selectedVerses.length; i++) {
    let el = selectedVerses[i]
    if (el > max && el < verse) {
      max = el
      index = i + 1
    }
  }
  selectedVerses.splice(index, 0, verse)
  return index
}
const generateArray = (from: number, to: number) => Array.from({length: to - from}, (_, i) => i + from)

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

export const insertVerses = (selectedVerses: number[], verse: number) => {
  if (selectedVerses.includes(verse))
    selectedVerses.length = 0
  else if (selectedVerses.length === 0)
    insertVerse(selectedVerses, verse)
  else {
    const index = insertVerse(selectedVerses, verse)
    let neighborVerse = selectedVerses[index - 1] ?? selectedVerses[index + 1]
    let neighborVerseIndex = verse > neighborVerse ? index - 1 : index + 1

    if (verse > neighborVerse){
      const verses = generateArray(neighborVerse + 1, verse)
      selectedVerses.splice(neighborVerseIndex + 1, 0, ...verses)
    }
    else{
      const verses = generateArray(verse + 1, neighborVerse)
      selectedVerses.splice(index + 1, 0, ...verses)
    }
  }
}
