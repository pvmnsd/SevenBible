import {myRef} from "src/helpers";
import {MyRef} from "src/types/myRef";
import {Bookmark, BookmarkCategory} from "app/types/bookmark";
import {provide, Ref, ref} from "vue";
import {bookmarks_} from "src/symbols";
import {MakeBookmarkArgs, RemoveBookmarkArgs} from "app/types/api-args/system";
import {CreateCategoryArgs} from "app/types/api-args/categories";
import useStore from "src/hooks/useStore";

let bookmarkFilename: Ref<string>
const bookmarkCategories: MyRef<BookmarkCategory[]> = myRef(null)

interface Category {
  name: string,
  index: number,
  backgroundColor?: string
}
const categoriesList = ref<Category[]>([])
const updateCategoriesList = () => {
  categoriesList.value = [
    {index: 0, name: 'all'},
    ...bookmarkCategories.value.map((category: BookmarkCategory, index) => ({
      name: category.name,
      backgroundColor: category.backgroundColor,
      index: index + 1
    }))
  ]
}

const fetchBookmarks = async () => {
  bookmarkCategories.value = await window.api.categories.getBookmarkCategories(bookmarkFilename.value)
  updateCategoriesList()
}

export interface BookmarkArgs {
  categoryName: string,
  bookmark: Bookmark
}
const addBookmark = async (args: BookmarkArgs) => {
  await window.api.categories.makeBookmark({filename: bookmarkFilename.value, ...args})
  await fetchBookmarks()
}
const editBookmark = async (args: BookmarkArgs, argsToDelete: BookmarkArgs) => {
  await deleteBookmark(argsToDelete.categoryName, argsToDelete.bookmark)
  await addBookmark(args)
}
const createCategory = async (newCategory: BookmarkCategory) => {
  await window.api.categories.createCategory({filename: bookmarkFilename.value, category: newCategory})
  await fetchBookmarks()
}
const getBookmarkIndex = (bookmarkCategory: string, bookmark: Bookmark) => {
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
  await window.api.categories.removeBookmark({filename: bookmarkFilename.value, ...indexes})
  await fetchBookmarks()
}
const deleteCategory = async (categoryName: string) => {
  await window.api.categories.deleteCategory({filename: bookmarkFilename.value, categoryName})
  await fetchBookmarks()
}

export const bookmarks = {
  fetchBookmarks,
  addBookmark,
  deleteBookmark,
  editBookmark,
  createCategory,
  bookmarkCategories,
  categoriesList,
  updateCategoriesList,
  deleteCategory
}

export const useBookmarks = () => {
  const store = useStore()
  bookmarkFilename = store.state.getReactive(`app.bookmarks.filename`)
  fetchBookmarks()
  provide(bookmarks_, bookmarks)

  return {
    bookmarkCategories,
    bookmarks
  }
}
