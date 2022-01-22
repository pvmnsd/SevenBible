import {ref} from "vue";


export default (props) => {
  const footnotes = ref(null)

  const getFootNotes = async () => {
    if(!props.bible.view.showDreamy || !window.system.fsExistsSync(['modules', 'commentaries', props.bible.fileName + '.commentaries.SQLite3']))
      return

    const settings = {
      filename: props.bible.fileName,
      bookNumber: props.bible.bookNumber,
      chapterNumber: props.bible.chapterNumber
    }
    footnotes.value = await window.commentaries.getFootnotes(settings)
  }

  return {
    footnotes,
    getFootNotes
  }
}
