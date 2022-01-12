import getBookCategory from "src/hooks/getBookCategory";

export default async (bookFileName) => {
  const settings = {bookFileName}
  const tables = await window.electron.invoke('get-bible-module-info', settings)

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
