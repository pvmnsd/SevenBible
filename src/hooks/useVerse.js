import {ref} from "vue";

export default () => {
  const versePopup = ref(null)
  const versePopupTarget = ref(undefined)
  const versePopupOptions = [
    {
      label: 'copy'
    }
  ]

  const onVerseContextmenu = ({target}) => {
    console.log('aa')
    versePopupTarget.value = target
    versePopup.value.toggle()
  }
  return {
    onVerseContextmenu,
    versePopup,
    versePopupTarget,
    versePopupOptions
  }
}
