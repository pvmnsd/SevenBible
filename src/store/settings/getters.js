export const bible = (state) => (id) => state.workPlace[id].bible
export const strong = (state) => (id) => state.workPlace[id].strong
export const commentaries = (state) => (id) => state.workPlace[id].commentaries
export const view = (state) => (id) => state.workPlace[id].bible.view
export const app = (state) => state.app
export const copySettings = state => state.app.copy
export const bibleActiveModules = state => {
  return state.workPlace.reduce((sum, curr, id) => {
    return curr.active ? {
      indexes: [...sum.indexes, id],
      fileNames: [...sum.fileNames, curr.bible.fileName],
      count: sum.indexes.length
    } : sum
  }, {indexes: [], fileNames: []})
}
export const activeWorkPlaceWindows = state => id => {
  const workPlace = state.workPlace[id]
  return {
    showStrong: workPlace.strong.show,
    showCommentaries: workPlace.commentaries.show,
    showDictionary: workPlace.dictionary.show
  }
}
