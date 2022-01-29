import {onMounted, ref, watch} from "vue"
import useSevenBible from "src/hooks/useSevenBible";

export default (store, id) => {
  const {refString} = useSevenBible()
  const arrows = ref({
    next: {ref: null, disabled: true},
    before: {ref: null, disabled: true}
  })

  const onNavigateClick = btn => {
    store.state.set(`workPlace.${id}.bible`, arrows.value[btn].ref)
  }
  const path = `workPlace.${id}.bible.`
  const getNavigationState = async () => {
    const settings = {
      bookNumber: store.state.get(path + 'bookNumber'),
      chapterNumber: store.state.get(path + 'chapterNumber'),
      filename: store.state.get(path + 'fileName')
    }
    const data = await window.bible.getTopBarState(settings)
    arrows.value = data.arrows
  }

  onMounted(() => getNavigationState())
  watch(refString, (n) => getNavigationState())

  return {
    arrows,
    onNavigateClick
  }
}
