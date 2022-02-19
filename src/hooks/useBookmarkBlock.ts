import {ref} from "vue";
import useSevenBible from "src/hooks/useSevenBible";
import {Bookmark} from "app/types/bookmark";
import {ChapterBookmarkCategories} from "src/types/chapter";

export default () => {
  const {bookmarks, updateBibleWindows, popup} = useSevenBible()
  const bookmarkBlockMenuRef = ref<any>()
  const bookmarkBlockMenuTarget = ref<EventTarget | null>()

  let selectedBookmarkCategory: string
  let selectedBookmark: Bookmark

  const onBookmarkBlockContextMenu = (event: Event, bookmarkCategory: string, bookmark: Bookmark) => {
    bookmarkBlockMenuRef.value.toggle()
    bookmarkBlockMenuTarget.value = event.target
    selectedBookmark = bookmark
    selectedBookmarkCategory = bookmarkCategory
  }
  const onBookmarkBlockClick = (bookmarkCategories: ChapterBookmarkCategories) => {
    popup.showBookmarksViewList({transparent: true, bookmarkCategories})
  }

  const bookmarkBlockContextMenu = [
    {
      title: 'show',
      callback: () => {
        console.log('show')
      }
    },
    {
      title: 'delete',
      callback: () => {
        bookmarks.deleteBookmark(selectedBookmarkCategory, selectedBookmark)
        updateBibleWindows()
      }
    }
  ]
  return {
    bookmarkBlockContextMenu,
    bookmarkBlockMenuRef,
    bookmarkBlockMenuTarget,
    onBookmarkBlockContextMenu,
    onBookmarkBlockClick
  }
}
