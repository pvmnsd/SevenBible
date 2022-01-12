import {ref} from "vue";
import useSevenBible from "src/hooks/useSevenBible";
import {useStore} from "vuex";


export default () => {
  const {state} = useStore()
  const {transitions, chosenVerse} = useSevenBible()
  const verseNumberPopupTarget = ref(undefined)
  const verseNumberPopup = ref(null)

  const onVerseNumberClick = ({target}, verseNumber) => {
    chosenVerse.value = verseNumber
    const verseNumberClickEvent = state.settings.app.control.verseNumberClickEvent
    verseNumberClickEvent === 'openCrossreferencesSearcher' ? openCrossreferencesSearcher()
      : openTranslationsComparator()
  }

  const openCrossreferencesSearcher = () => {
    transitions.crossreferencesSearcher = true
  }
  const openTranslationsComparator = () => {
    transitions.translationsComparator = true
  }

  const onVerseNumberContextMenu = ({target}, verseNumber) => {
    chosenVerse.value = verseNumber
    verseNumberPopupTarget.value = target
    verseNumberPopup.value.show()
  }

  return {
    verseNumberPopup,
    verseNumberPopupTarget,
    onVerseNumberClick,
    onVerseNumberContextMenu,
    openCrossreferencesSearcher,
    openTranslationsComparator
  }
}
