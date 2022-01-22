import {onMounted, ref, watch} from "vue"

export default (props, store, id) => {
  const arrows = ref({
    next: {ref: null, disabled: true},
    before: {ref: null, disabled: true}
  })

  const onNavigateClick = btn => {
    store.state.set(`workPlace.${id}.bible`, arrows.value[btn].ref)
  }
  const getNavigationState = async () => {
    const settings = {
      bookNumber: props.bookNumber,
      chapterNumber: props.chapterNumber,
      filename: props.bibleFileName
    }
    const data = await window.bible.getTopBarState(settings)
    arrows.value = data.arrows
  }

  onMounted(() => getNavigationState())
  watch(() => props.refString, () => getNavigationState())

  return {
    arrows,
    onNavigateClick
  }
}
