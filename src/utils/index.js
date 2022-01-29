import {getBookCategory} from "src/helpers";

export const initBooksCategories = booksList => {
  if (booksList[0].bookCategory) return
  booksList.forEach(book => {
    book.bookCategory = getBookCategory(book.book_number)
  })
}
