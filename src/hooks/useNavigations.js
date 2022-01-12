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
      bookFileName: props.bookFileName
    }
    const data = await window.electron.invoke('get-top-bar-state', settings)
    arrows.value = data.arrows
  }

  onMounted(() => getNavigationState())
  watch(() => props.refString, () => getNavigationState())

  return {
    arrows,
    onNavigateClick
  }
}
