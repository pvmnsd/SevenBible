
export default async (bibleFileName) => {
  const settings = {filename: bibleFileName}
  const tables = await window.bible.getModuleInfo(settings)

  const booksList = tables.booksList
  const info = tables.info

  return {
    booksList,
    info
  }
}
