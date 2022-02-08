import {ref} from "vue";
import normalizeSearchInput from "src/hooks/normalizeSearchInput";
import {highlightWords} from "src/helpers/highlight";

export default (bibleFileName) => {
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
      filename: bibleFileName.value
    }
    foundedTexts.value = await window.api.bible.getFindedTexts(settings)
    textsCount.value = foundedTexts.value.length
    showLoader.value = false

    foundedTexts.value.forEach(item => {
      item.text = highlightWords(item.text, keywordsToHighlight)
    })

  }

  return {
    showLoader,
    searchInput,
    textsCount,
    foundedTexts,
    searchText
  }
}
