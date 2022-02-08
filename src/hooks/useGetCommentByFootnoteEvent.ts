import {Ref, ref} from "vue";
import {Commentaries} from "src-electron/types/commentaries";
import getCommentByRef from 'src/helpers/getCommentByRef'
import {BibleRef} from "src/types/bibleRef";

export default (footnotes: Ref<Commentaries[]>) => {
  const htmlPopupTarget: Ref<Element | undefined> = ref(undefined)
  const htmlPopupText = ref('null')
  const htmlPopup: Ref = ref(null)

  const onGetCommentByFootnote = (target: Element, ref: BibleRef) => {
    htmlPopupTarget.value = target
    const comment = getCommentByRef(footnotes.value, ref)
    if (!comment) return
    htmlPopupText.value = comment.text
    htmlPopup.value.toggle()
  }
  return {
    onGetCommentByFootnote,
    htmlPopup,
    htmlPopupText,
    htmlPopupTarget
  }
}
