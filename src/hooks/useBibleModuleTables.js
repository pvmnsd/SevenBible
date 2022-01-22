import getBookCategory from "src/hooks/getBookCategory";

export default async (bibleFileName) => {
  const settings = {filename: bibleFileName}
  const tables = await window.bible.getModuleInfo(settings)

  const booksList = tables.booksList
  const info = tables.info

  const initBooksCategories = () => {
    booksList.forEach(book => {
      book.bookCategory = getBookCategory(book.book_number)
    })
  }

  return {
    booksList,
    info,
    initBooksCategories
  }
}
