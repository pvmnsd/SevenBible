import {inject, InjectionKey} from "vue";
import {BibleBooksFront} from "src/types/bibleModule";
import {BookNumbers, nonCanonicalBooks} from "src-electron/types/bookNumbers";
import {BookCategories} from "src-electron/types/bookCategory";

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
