import {ref} from "vue";
import {debounce} from "quasar";

export default (id, store, commentariesModule) => {
  const commentaries = ref([])
  const showLoader = ref(false)

  const debouncedGetCommentaries = debounce(async () => {
    const settings = {
      chapterNumber: store.native.state.settings.workPlace[id].bible.chapterNumber,
      bookNumber: store.native.state.settings.workPlace[id].bible.bookNumber,
      commentaryFileName: commentariesModule.value.fileName
    }
    let commentariesData
    commentariesData = await window.electron.invoke('get-commentaries', settings)
    commentaries.value = commentariesData
    showLoader.value = false
  }, 500)

  const getCommentaries = () => {
    showLoader.value = true
    debouncedGetCommentaries()
  }

  return {
    commentaries,
    showLoader,
    getCommentaries
  }
}
