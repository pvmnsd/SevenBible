import {Ref, ref} from 'vue'
import useSevenBible from "src/hooks/useSevenBible";
import {useI18n} from "vue-i18n";
import {splitWords} from "src/helpers/regex";
import {Bible} from "src/types/store/bible";
import {BibleVerses} from "src-electron/types/bible";

export default ({bible, bibleError}:{bible: Ref<Bible>, bibleError: any}) => {
  const {t} = useI18n()
  const chapter = ref<BibleVerses[]>()
  const {bookFullName, bookShortName} = useSevenBible()

  const getChapter = async () => {
    let settings = {
      filename: bible.value.fileName,
      bookNumber: bible.value.bookNumber,
      chapterNumber: bible.value.chapterNumber,
      showSubheadings: bible.value.view.showSubheadings,
      showCommentaries: bible.value.view.showCommentaries,
      showDreamy: bible.value.view.showDreamy,
      embededOverwriteOthers: bible.value.view.subheadings.embededOverwriteOthers,
      activeModulesSubheadings: [...bible.value.view.subheadings.activeModules],
      activeModulesCommentaries: [...bible.value.view.commentaries.activeModules],
    }
    bibleError.value.show = false
    let data = await window.api.bible.getChapter(settings)
    if (!data.bookNames) {
      bibleError.value.message = t('bookNotFounded').format(settings.filename)
      bibleError.value.show = true
      return
    }

    //set abreviatures
    bookFullName.value = data.bookNames.bookFullName
    bookShortName.value = data.bookNames.bookShortName

    //parse text
    data.texts.forEach((element: any) => element.text = splitWords(element.text))
    //stories
    data.stories?.forEach((story: any) => {
      data.texts[story.verse - 1].story = story.title
    })
    //subheadings
    data.subheadings?.forEach((subheading: any) => {
      const verseNumber = subheading.verse - 1
      if (!data.texts[verseNumber].subheadings) data.texts[verseNumber].subheadings = []
      data.texts[verseNumber].subheadings.push(subheading)
    })
    //commentaries
    if (data.commentaries) {
      Object.keys(data.commentaries).forEach(moduleName => {
        for (let commentaryModule of data.commentaries[moduleName]) {
          commentaryModule.moduleName = moduleName
          const idx = commentaryModule.verse_number_to ? commentaryModule.verse_number_to - 1 : commentaryModule.verse_number_from - 1
          if (idx <= 0) continue
          if (!data.texts[idx].commentaries) data.texts[idx].commentaries = []
          data.texts[idx].commentaries.push(commentaryModule)
        }
      })
    }
    chapter.value = data.texts
  }

  return {
    chapter,
    getChapter
  }
}