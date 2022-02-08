export default async (bibleFileName) => {
  const settings = {filename: bibleFileName}
  const info = await window.api.bible.getBibleInfo(settings)
  const booksList = await window.api.bible.getBibleBooks(settings)


  return {
    booksList,
    info
  }
}
