import {myRef} from "src/helpers";
import {MyRef} from "src/types/myRef";
import {Bookmark, BookmarkCategory} from "app/types/bookmark";
import {provide} from "vue";
import {bookmarks_} from "src/symbols";
import {MakeBookmarkArgs, RemoveBookmarkArgs} from "app/types/api-args/systemArgs";

const bookmarkCategories: MyRef<BookmarkCategory[]> = myRef(null)

const fetchBookmarks = async () => {
  bookmarkCategories.value = await window.api.system.getBookmarkCategories()
}
const addBookmark = async (args: MakeBookmarkArgs) => {
  await window.api.system.makeBookmark(args)
  await fetchBookmarks()
}
const editBookmark = async (args: MakeBookmarkArgs, argsToDelete: MakeBookmarkArgs) => {
  await deleteBookmark(argsToDelete.categoryName, argsToDelete.bookmark)
  await addBookmark(args)
}
const getBookmarkIndex = (bookmarkCategory: string, bookmark: Bookmark): RemoveBookmarkArgs => {
  const categoryIndex = bookmarkCategories.value.findIndex(category => category.name === bookmarkCategory)

  const bookmarkIndex = bookmarkCategories.value[categoryIndex].bookmarks.findIndex(curr => {
    return curr.description === bookmark.description
      && curr.bookNumber === bookmark.bookNumber
      && curr.startVerseNumber === bookmark.startVerseNumber
      && curr.endVerseNumber === bookmark.endVerseNumber
      && curr.startChapterNumber === bookmark.startChapterNumber
      && curr.endChapterNumber === bookmark.endChapterNumber
      && curr.dateCreated === bookmark.dateCreated
      && curr.dateModified === bookmark.dateModified
  })
  return {
    categoryIndex,
    bookmarkIndex
  }
}

const deleteBookmark = async (bookmarkCategory: string, bookmark: Bookmark) => {
  const indexes = getBookmarkIndex(bookmarkCategory, bookmark)
  const {categoryIndex, bookmarkIndex} = indexes
  if (categoryIndex < 0 || bookmarkIndex < 0)
    return
  bookmarkCategories.value[categoryIndex].bookmarks.splice(bookmarkIndex, 1)
  bookmarkCategories.value[categoryIndex].bookmarks
  await window.api.system.removeBookmark(indexes)
  return
}

export const bookmarks = {
  fetchBookmarks,
  addBookmark,
  deleteBookmark,
  editBookmark,
  bookmarkCategories
}

export const useBookmarks = () => {
  fetchBookmarks()
  provide(bookmarks_, bookmarks)

  return {
    bookmarkCategories,
    bookmarks
  }
}
