import {ref} from "vue"
import {insertVerse, insertVerses} from "src/helpers/verseSelector";

export default () => {
  const selectedVerses = ref([])

  const onSelectorClick = (verseNumber) => {
    if (selectedVerses.value.includes(verseNumber))
      selectedVerses.value.remove(verseNumber)
    else
      insertVerse(selectedVerses.value, verseNumber)
  }
  const onSelectorHold = (verseNumber) => {
    insertVerses(selectedVerses.value, verseNumber)
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
