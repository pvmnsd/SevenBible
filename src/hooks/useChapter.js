import {ref} from 'vue'
import parseText from "src/hooks/parseText";
import useSevenBible from "src/hooks/useSevenBible";

export default (props) => {
  const chapter = ref(null)
  const {bookFullName, bookShortName} = useSevenBible()

  const getChapter = async () => {
    let settings = {
      bookFileName: props.bible.fileName,
      bookNumber: props.bible.bookNumber,
      chapterNumber: props.bible.chapterNumber,
      showSubheadings: props.bible.view.showSubheadings,
      showCommentaries: props.bible.view.showCommentaries,
      showDreamy: props.bible.view.showDreamy,
      embededOverwriteOthers: props.bible.view.subheadings.embededOverwriteOthers,
      activeModulesSubheadings: [...props.bible.view.subheadings.activeModules],
      activeModulesCommentaries: [...props.bible.view.commentaries.activeModules],
    }

    let data =  await window.electron.invoke('get-chapter', settings)
    //set abreviatures
    bookFullName.value = data.bookNames.bookFullName
    bookShortName.value = data.bookNames.bookShortName

    //parse text
    data.texts.forEach(element => element.text = parseText(element.text))
    //stories
    data.stories?.forEach(story => {
      data.texts[story.verse - 1].story = story.title
    })
    //subheadings
    data.subheadings?.forEach(subheading => {
      const verseNumber = subheading.verse - 1
      if (!data.texts[verseNumber].subheadings) data.texts[verseNumber].subheadings = []
      data.texts[verseNumber].subheadings.push(subheading)
    })
    //commentaries
    if (data.commentaries) {
      Object.keys(data.commentaries).forEach(moduleName => {
        data.commentaries[moduleName].forEach(commentaryModule => {
          commentaryModule.moduleName = moduleName
          const idx = commentaryModule.verse_number_to ? commentaryModule.verse_number_to - 1 : commentaryModule.verse_number_from - 1
          if (!data.texts[idx].commentaries) data.texts[idx].commentaries = []
          data.texts[idx].commentaries.push(commentaryModule)
        })
      })
    }
    chapter.value = data.texts
  }

  return{
    chapter,
    getChapter,
    bookFullName,
    bookShortName
  }
}
