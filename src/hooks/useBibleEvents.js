import useStrongSearchEvent from "src/hooks/useStrongSearchEvent";
import useGetCommentByFootnoteEvent from "src/hooks/useGetCommentByFootnoteEvent";

export default (id, store, footnotes, props) => {

  const {onStrongSearch} = useStrongSearchEvent(id, store, props, props)
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
        strongNumbers: [props.strongNumbersPrefix + target.innerText]
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
