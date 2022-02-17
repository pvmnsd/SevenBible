import {Bookmark} from "app/types/bookmark";

export interface MakeBookmarkArgs {
  categoryName: string,
  bookmark: Bookmark
}

export interface RemoveBookmarkArgs {
  categoryIndex: number,
  bookmarkIndex: number
}
