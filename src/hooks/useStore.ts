import {useStore} from "vuex";
import {computed} from "vue";
import {activeWorkPlaceWindows} from "src/store/settings/getters";
import {BibleRef} from "src/types/bibleRef";

export default () => {
  const store = useStore()

  const state = {
    get: (path: string) => Object.getValue(path, store.state.settings),
    getReactive: (path: string) => computed(() => Object.getValue(path, store.state.settings)),
    set(path: string, value: any) {
      store.commit('settings/setState', {path, value})
    },
    setBibleRef: (id: number, bibleRef: BibleRef) => {
      if (bibleRef)
        state.set(`workPlace.${id}.bible`, bibleRef)
    },
    native: store.state
  }
  const getters = {
    getActiveWorkPlaces: () => store.getters["settings/bibleActiveModules"],
    getActiveWorkPlaceWindows: (id: number) => store.getters["settings/activeWorkPlaceWindows"](id)
  }
  const mutations = {
    closeWorkPlace: (id: number) => store.commit('settings/closeWorkPlace', id),
    toggleSubheadingsModule: (id: number, moduleName: string, value: any) =>
      store.commit('settings/toggleActiveModule', {id, key: 'subheadings', name: moduleName, value}),
    toggleCommentariesModule: (id: number, moduleName: string, value: any) =>
      store.commit('settings/toggleActiveModule', {id, key: 'commentaries', name: moduleName, value})
  }

  return {
    native: store,
    state,
    getters,
    mutations
  }
}
