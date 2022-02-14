import {myRef} from "src/helpers";
import {MyRef} from "src/types/myRef";
import {BookmarkCategory} from "app/types/bookmark";
import {provide} from "vue";
import {bookmarks_} from "src/symbols";

const bookmarkCategories: MyRef<BookmarkCategory[]> = myRef(null)

const fetchBookmarks = async () => {
  bookmarkCategories.value = await window.api.system.getBookmarkCategories()
}

export const bookmarks = {
  bookmarkCategories,
  fetchBookmarks
}
export default () => {
  fetchBookmarks()
  provide(bookmarks_, bookmarks)
}
