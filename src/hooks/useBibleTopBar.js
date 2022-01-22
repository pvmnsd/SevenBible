import {computed} from "vue";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";
import useNavigations from "src/hooks/useNavigations";

export default (props) => {
  const {id, transitions, activeWorkPlaces} = useSevenBible()
  const store = useStore()
  const {arrows, onNavigateClick} = useNavigations(props, store, id)

  const closeWindow = () => store.mutations.closeWorkPlace(id)

  const activeWorkPlacesCount = computed(() => activeWorkPlaces.value.indexes.length)

  const openWindow = (windowName) => {
    transitions[windowName] = true
  }
  return {
    arrows,
    onNavigateClick,
    closeWindow,
    openWindow,
    activeWorkPlacesCount
  }
}
