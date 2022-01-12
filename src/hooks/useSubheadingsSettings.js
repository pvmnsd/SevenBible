import {onMounted, ref} from "vue";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";

export default () => {
  const {id, transitions, bibleTextKey} = useSevenBible()
  const store = useStore()


  const close = () => {
    bibleTextKey.value++
    transitions.subheadingsSettings = false
  }

  const subheadingsModulesList = ref([])

  onMounted(() => {
    subheadingsModulesList.value =
      window.system.fsReaddirSync(['modules', 'subheadings'])
        .map(moduleName => moduleName
          .match(/.+?(?=\.)/g)[0])
  })
  const changeSubheadingsSetting = (name, value) =>
    store.state.set(`workPlace.${id}.bible.view.subheadings.${name}`, value)

  const addNewActiveSubheadingModule = (moduleName, value) => {
    store.mutations.toggleSubheadingsModule(id, moduleName, value)
  }

  const subheadings = store.state.get(`workPlace.${id}.bible.view.subheadings`)

  return {
    subheadingsModulesList,
    subheadings,
    close,
    changeSubheadingsSetting,
    addNewActiveSubheadingModule,
  }
}
