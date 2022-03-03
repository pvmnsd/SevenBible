import {inject, InjectionKey} from "vue";
import {BibleBooksFront} from "src/types/bibleModule";
import {BookNumbers, nonCanonicalBooks} from "app/types/bookNumbers";
import {BookCategories} from "app/types/bookCategory";

export const myRef = (value: any) => ({value})

export const getBookCategory = (bookNumber: BookNumbers): BookCategories => {
  return nonCanonicalBooks.includes(bookNumber) ? BookCategories.NonCanonical
    : (bookNumber <= BookNumbers.Deu) ? BookCategories.Torah
      : (bookNumber <= BookNumbers.Esth) ? BookCategories.MajorProphets
        : (bookNumber <= BookNumbers.Song) ? BookCategories.Poetry
          : (bookNumber <= BookNumbers.Mal) ? BookCategories.MinorProphets
            : (bookNumber <= BookNumbers.John) ? BookCategories.Gospels
              : (bookNumber === BookNumbers.Acts) ? BookCategories.Acts
                : (bookNumber <= BookNumbers.Jud) ? BookCategories.Epistles
                  : (bookNumber === BookNumbers.Rev) ? BookCategories.Revelations
                    : BookCategories.NonCanonical
}


export const clearTags = (html: string) => html.replace(/(<[Smfnh]>.+?<\/[Smfnh]>|<[^>]+>)/g, "")

export const cropString = (string: string, length: number) => string.length > length ? string.slice(0, length) + '...' : string

export const injectStrict = <T>(key: InjectionKey<T>, fallback?: T) => {
  const resolved = inject(key, fallback)
  if (resolved === null || resolved === undefined)
    throw new Error(`Could not resolve ${key.description}`)
  return resolved
}


export const initBooksCategories = (booksList: BibleBooksFront[]) => {
  if (booksList[0].bookCategory) return
  booksList.forEach((book: BibleBooksFront) => {
    book.bookCategory = getBookCategory(book.book_number)
  })
}

export const createDateString = () => {
  return new Date().toLocaleString('en', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour: "2-digit",
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h24',
  })
    .replace(/\//g, '-')
    .replace(/,/, '')
}

export const isEqual = (object1: any, object2: any) => {
  const props1 = Object.getOwnPropertyNames(object1);
  const props2 = Object.getOwnPropertyNames(object2);

  if (props1.length !== props2.length) {
    return false;
  }

  for (let i = 0; i < props1.length; i += 1) {
    const prop = props1[i];
    const bothAreObjects = typeof (object1[prop]) === 'object' && typeof (object2[prop]) === 'object';

    if ((!bothAreObjects && (object1[prop] !== object2[prop]))
      || (bothAreObjects && !isEqual(object1[prop], object2[prop]))) {
      return false;
    }
  }

  return true;
}

export const refToString = (bookName: string, chapterNumber: number, startVerseNumber?: number, endVerseNumber?: number) => {
  if (!startVerseNumber)
    return `${bookName} ${chapterNumber}`
  else if (startVerseNumber === endVerseNumber)
    return `${bookName} ${chapterNumber}:${startVerseNumber}`
  else
    return `${bookName} ${chapterNumber}:${startVerseNumber}-${endVerseNumber}`
}
