import parseText from "src/hooks/parseText"

export default async function (props, chapterText, textScrollArea, isError, errorMessage) {

  let settings = {
    bookFileName: props.bookFileName,
    bookNumber: props.bookNumber,
    chapterNumber: props.chapterNumber,
    showSubheadings: props.view.showSubheadings,
    showCommentaries: props.view.showCommentaries,
    showDreamy: props.view.showDreamy,
    embededOverwriteOthers: props.view.subheadings.embededOverwriteOthers,
    activeModulesSubheadings: [...props.view.subheadings.activeModules],
    activeModulesCommentaries: [...props.view.commentaries.activeModules],
  }

  let data =  await window.electron.invoke('get-chapter', settings)
  //Errors check
  if (!data.texts.length) {
    errorMessage.value = 'Текущий модуль не содержит стихов для выбраной книги'
    isError.value = true
    return
  }
  else isError.value = false
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
  chapterText.value = data.texts
  textScrollArea.value.setScrollPosition("vertical", 0)
}
