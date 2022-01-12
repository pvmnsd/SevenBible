import {ref} from "vue";
import normalizeSearchInput from "src/hooks/normalizeSearchInput";
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
export default (bookFileName) => {
  const showLoader = ref(false)
  const searchInput = ref('')
  let normalizedSearchInput = ''
  let keywordsToHighlight = []
  const textsCount = ref(0)


  const foundedTexts = ref([])
  const searchText = async () => {
    showLoader.value = true
    textsCount.value = 0
    normalizedSearchInput = normalizeSearchInput(searchInput.value)
    keywordsToHighlight = normalizedSearchInput.split(' ')

    const settings = {
      searchString: normalizedSearchInput,
      bookFileName: bookFileName.value
    }
    foundedTexts.value = await window.electron.invoke('find-texts-in-bible', settings)
    textsCount.value = foundedTexts.value.length
    showLoader.value = false
  }

  return {
    showLoader,
    searchInput,
    textsCount,
    foundedTexts,
    searchText
  }
}
