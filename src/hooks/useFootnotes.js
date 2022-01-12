import {ref} from "vue";


export default (props) => {
  const footnotes = ref(null)

  const getFootNotes = async () => {
    if(!props.bible.view.showDreamy || !window.system.fsExistsSync(['modules', 'commentaries', props.bible.bookFileName + '.commentaries.SQLite3']))
      return

    const settings = {
      moduleName: props.bible.bookFileName,
      bookNumber: props.bible.bookNumber,
      chapterNumber: props.bible.chapterNumber
    }
    footnotes.value = await window.electron.invoke('get-footnotes', settings)
  }

  return {
    footnotes,
    getFootNotes
  }
}
