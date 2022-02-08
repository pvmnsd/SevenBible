import {Commentaries} from "src-e/types/commentaries";
import {BibleRef} from "src/types/bibleRef";

export default (commentaries: Commentaries[], ref: BibleRef) =>
  commentaries.find(comment =>
    comment.chapter_number_from === ref.chapterNumber
    && comment.verse_number_from === ref.verseNumber
  )
