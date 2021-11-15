export const bible = (state) => (id) => state.windows[id].bible
export const strong = (state) => (id) => state.windows[id].strong
export const commentaries = (state) => (id) => state.windows[id].commentaries
export const view = (state) => (id) => state.windows[id].bible.view
export const programSettings = (state) => state.programSettings
export const bibleActiveModules = state => state.windows.reduce((sum, curr, id) => {
  return curr.active ? [...sum, {
    id,
    bookFileName: curr.bible.fileName
  }] : sum
}, [])
