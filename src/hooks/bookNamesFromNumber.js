export default function (number, booksList) {
  const book = booksList.filter(book => book.book_number === number)[0]
  if (!book)
    return {}
  return {
    bookFullName: book.long_name,
    bookShortName: book.short_name
  }
}
