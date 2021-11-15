export default async function (bookFileName) {
  const settings = {bookFileName}
  const data = await window.electron.invoke('get-bible-module-info', settings)
  let booksList = data.booksList
  let info = data.info

  return { booksList, info }
}
