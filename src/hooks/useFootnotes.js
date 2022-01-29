import {ref} from "vue";


export default (bible) => {
  const footnotes = ref(null)

  const getFootNotes = async () => {
    if(!bible.value.view.showDreamy || !window.system.fsExistsSync(['modules', 'commentaries', bible.value.fileName + '.commentaries.SQLite3']))
      return

    const settings = {
      filename: bible.value.fileName,
      bookNumber: bible.value.bookNumber,
      chapterNumber: bible.value.chapterNumber
    }
    footnotes.value = await window.commentaries.getFootnotes(settings)
  }

  return {
    footnotes,
    getFootNotes
  }
}
