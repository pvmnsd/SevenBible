import {Ref, ref} from "vue";
import {Bible} from "src/types/bible";
import {Commentaries} from "src-e/types/commentaries";


export default (bible: Ref<Bible>) => {
  const footnotes: Ref<Commentaries[] | null> = ref(null)

  const getFootNotes = async () => {
    if(!bible.value.view.showDreamy || !window.api.system.fsExistsSync(['modules', 'commentaries', bible.value.fileName + '.commentaries.SQLite3']))
      return

    const settings = {
      filename: bible.value.fileName,
      bookNumber: bible.value.bookNumber,
      chapterNumber: bible.value.chapterNumber
    }
    footnotes.value = await window.api.commentaries.getFootnotes(settings)
  }

  return {
    footnotes,
    getFootNotes
  }
}
