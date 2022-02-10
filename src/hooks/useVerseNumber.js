import {ref} from "vue";
import useStore from "src/hooks/useStore";
import useSevenBible from "src/hooks/useSevenBible";


export default ({copyVerses}) => {
  const store = useStore()
  const {id, popup} = useSevenBible()
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
    const ref = await popup.showCrossreferencesSearcher({selectedVerses: [selectedVerse]})
    store.state.setBibleRef(id, ref)
  }
  const openTranslationsComparator = async () => {
    const ref = await popup.showTranslationsComparator({selectedVerses: [selectedVerse]})
    store.state.setBibleRef(id, ref)
  }
  const openCommentariesComparator = () => popup.showCommentariesComparator({verseNumber: selectedVerse})
  const openBookmarkCreator = () => {
    popup.showBookmarkCreator({selectedVerseFrom: selectedVerse})
  }

  const verseMenuItems = [
    {
      title: 'compareTranslations',
      callback: openTranslationsComparator
    },
    {
      title: 'addBookmark',
      callback: openBookmarkCreator
    },
    {
      title: 'searchCrossreferences',
      callback: openCrossreferencesSearcher
    },
    {
      title: 'searchCommentaries',
      callback: openCommentariesComparator
    },
    {
      title: 'copy',
      callback: () => copyVerses([selectedVerse])
    },
    {
      title: 'makeBookmark',
      callback: openBookmarkCreator
    }
  ]


  return {
    verseMenuItems,
    verseNumberPopup,
    verseNumberPopupTarget,
    onVerseNumberClick,
    onVerseNumberContextMenu,
    openCrossreferencesSearcher,
    openTranslationsComparator,
    openBookmarkCreator,
  }
}
