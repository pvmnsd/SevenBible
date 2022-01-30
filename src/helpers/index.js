export const myRef = value => ({value})

export const getBookCategory = bookNumber => {
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

export const convertVerses = (verses = [1, 3, 4, 5,6,7,8,9, 11,13,14]) => {
  let res = verses[0].toString()
  for (let i = 1; i < verses.length; i++) {
    const verse = verses[i]
    if (verse - 1 !== verses[i - 1])
      res += `,${verse}`
    else{
      let lastIndex
      for (let j = i; j < verses.length; j++){
        if (j === verses.length - 1) {
          lastIndex = j
          break
        }
        else if (verses[j + 1] !== verses[j] + 1){
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

