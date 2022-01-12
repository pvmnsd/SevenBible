export const settingsScheme = {
  app: {
    theme: "light",
    font: "Roboto",
    win: {
      width: 800,
      height: 700
    }
  },
  workPlace: [
    {
      active: true,
      bible: {
        fileName: "",
        bookNumber: 10,
        chapterNumber: 1,
        view: {
          showBookName: true,
          showChapterNumber: true,
          showSubheadings: true,
          subheadings: {
            embededOverwriteOthers: true,
            activeModules: []
          },
          showCommentaries: false,
          commentaries: {
            activeModules: []
          },
          showVerseNumber: true,
          showJesusWords: true,
          showStrongNumbers: false,
          showParagraphs: false,
          showContinuousText: false,
          showDreamy: true,
          fontSize: 16
        }
      },
      strong: {
        show: false,
        windowHeight: 150,
        fileName: "",
        strongNumbers: [],
        view: {
          test: false
        }
      },
      dictionary: {
        show: false,
        windowHeight: 150,
        fileName: "",
        view: {
          test: false
        }
      },
      commentaries: {
        show: false,
        windowHeight: 150,
        fileName: "",
        view: {
          test: false
        }
      }
    }
  ]
}
