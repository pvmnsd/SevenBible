import {ref} from "vue"

export default () => {
  const selectedVerses = ref([])

  const onSelectorClick = (verseNumber) => {
    if (selectedVerses.value.includes(verseNumber))
      selectedVerses.value.remove(verseNumber)
    else
      selectedVerses.value.insert(verseNumber)
  }
  const onSelectorHold = (verseNumber) => {
    console.log('hold', verseNumber)
  }
  const clearSelectedVerses = () => {
    selectedVerses.value = []
  }

  return {
    selectedVerses,
    onSelectorHold,
    onSelectorClick,
    clearSelectedVerses
  }
}
