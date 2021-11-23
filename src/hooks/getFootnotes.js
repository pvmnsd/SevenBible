export default async function (props) {
  if(!props.view.showDreamy || !window.system.fsExistsSync(['modules', 'commentaries', props.bookFileName + '.commentaries.SQLite3']))
    return

  const settings = {
    moduleName: props.bookFileName,
    bookNumber: props.bookNumber,
    chapterNumber: props.chapterNumber
  }
  return await window.electron.invoke('get-footnotes', settings)
}
