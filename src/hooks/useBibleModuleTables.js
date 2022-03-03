export default async (bibleFileName) => {
  const info = await window.api.bible.getBibleInfo(bibleFileName)
  const booksList = await window.api.bible.getBibleBooks(bibleFileName)


  return {
    booksList,
    info
  }
}
