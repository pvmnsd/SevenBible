import {ref} from "vue";

export default (footnotes) => {
  const htmlPopupTarget = ref(undefined)
  const htmlPopupText = ref(null)
  const htmlPopup = ref(null)

  const onGetCommentByFootnote = (target) => {
    htmlPopupTarget.value = target
    htmlPopupText.value = footnotes.value[target.outerText]
    htmlPopup.value.toggle()
  }
  return{
    onGetCommentByFootnote,
    htmlPopup,
    htmlPopupText,
    htmlPopupTarget
  }
}
