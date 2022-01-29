import useStrongSearchEvent from "src/hooks/useStrongSearchEvent";
import useGetCommentByFootnoteEvent from "src/hooks/useGetCommentByFootnoteEvent";
import useSevenBible from "src/hooks/useSevenBible";

export default (id, store, footnotes) => {
  const {strongNumbersPrefix} = useSevenBible()
  const {onStrongSearch} = useStrongSearchEvent(id, store, strongNumbersPrefix)
  const {
    onGetCommentByFootnote,
    htmlPopup,
    htmlPopupText,
    htmlPopupTarget
  } = useGetCommentByFootnoteEvent(footnotes)

  const onVerseClick = ({target}) => {
    if (target.tagName === "S")
      store.state.set(`workPlace.${id}.strong`, {
        show: true,
        strongNumbers: [strongNumbersPrefix.value + target.innerText]
      })

    if (target.tagName === "W")
      onStrongSearch(target)

    if (target.tagName === "F")
      onGetCommentByFootnote(target)
  }

  return {
    onVerseClick,
    htmlPopup,
    htmlPopupText,
    htmlPopupTarget
  }
}
