interface Subheadings {
  embededOverwriteOthers: boolean,
  activeModules: string[]
}
interface Commentaries {
  activeModules: string[]
}

interface View {
  showBookName: true,
  showChapterNumber: true,
  showSubheadings: true,
  subheadings: Subheadings,
  showCommentaries: boolean,
  commentaries: Commentaries,
  showVerseNumber: boolean,
  showJesusWords: boolean,
  showStrongNumbers: boolean,
  showParagraphs: boolean,
  showContinuousText: boolean,
  showDreamy: boolean,
  fontSize: number
}

export interface Bible {
    fileName: string,
    bookNumber: number,
    chapterNumber: number,
    view: View
}
