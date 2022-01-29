import {ref} from "vue";
import {usePopupWindows} from "boot/popupWindows";
import useStore from "src/hooks/useStore";
import {VerseNumberActions, WorkModes} from "src/objects";
import useSevenBible from "src/hooks/useSevenBible";


export default () => {
  const store = useStore()
  const {id} = useSevenBible()
  const {showCrossreferencesSearcher, showTranslationsComparator} = usePopupWindows()
  const verseNumberPopupTarget = ref(undefined)
  const verseNumberPopup = ref(null)

  let selectedVerse

  const onVerseNumberClick = ({target}, verseNumber) => {
    selectedVerse = verseNumber
    const verseNumberClickEvent = store.state.native.settings.app.control.verseNumberClickEvent
    verseNumberClickEvent === 'openCrossreferencesSearcher' ? openCrossreferencesSearcher()
      : openTranslationsComparator()
  }

  const onVerseNumberContextMenu = ({target}, verseNumber) => {
    selectedVerse = verseNumber

    verseNumberPopupTarget.value = target
    verseNumberPopup.value.show()
  }

  const openCrossreferencesSearcher = async () => {
    const ref = await showCrossreferencesSearcher({selectedVerses: [selectedVerse]})
    store.state.setBibleRef(id, ref)
  }
  const openTranslationsComparator = async () => {
    const ref = await showTranslationsComparator({selectedVerses: [selectedVerse]})
    store.state.setBibleRef(id, ref)
  }
  const openBookmarkCreator = () => {
    // transitions.bookmarkCreator = true
  }

  const verseMenuItems = [
    {
      title: 'compareTranslations',
      callback: () => openTranslationsComparator()
    },
    {
      title: 'addBookmark',
      callback: () => openBookmarkCreator()
    },
    {
      title: 'searchCrossreferences',
      callback: () => openCrossreferencesSearcher()

    },
  ]


  return {
    verseMenuItems,
    verseNumberPopup,
    verseNumberPopupTarget,
    onVerseNumberClick,
    onVerseNumberContextMenu,
    openCrossreferencesSearcher,
    openTranslationsComparator,
    openBookmarkCreator
  }
}
