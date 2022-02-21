import useSevenBible from "src/hooks/useSevenBible";
import {ChapterBookmarkCategories} from "src/types/chapter";

export default () => {
  const { popup} = useSevenBible()

  const onBookmarkBlockClick = (bookmarkCategories: ChapterBookmarkCategories, verseNumber: number) => {
    popup.showBookmarksViewList({transparent: true, bookmarkCategories, verseNumber })
  }

  return {
    onBookmarkBlockClick
  }
}
