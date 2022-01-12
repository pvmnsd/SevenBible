import {useStore} from "vuex";
import {computed} from "vue";
import {activeWorkPlaceWindows} from "src/store/settings/getters";

export default () => {
  const store = useStore()

  const state = {
    get: (path) => Object.getValue(path, store.state.settings),
    getReactive: (path) => computed(() => Object.getValue(path, store.state.settings)),
    set: (path, value) => store.commit('settings/setState', {path, value}),
    native: store.state
  }
  const getters = {
    getActiveWorkPlaces: () => store.getters["settings/bibleActiveModules"],
    getActiveWorkPlaceWindows : (id) => store.getters["settings/activeWorkPlaceWindows"](id)
  }
  const mutations = {
    closeWorkPlace: id => store.commit('settings/closeWorkPlace', id),
    toggleSubheadingsModule: (id, moduleName, value) =>
      store.commit('settings/toggleActiveModule', {id, key: 'subheadings', name: moduleName, value}),
    toggleCommentariesModule: (id, moduleName, value) =>
      store.commit('settings/toggleActiveModule', {id, key: 'commentaries', name: moduleName, value})
  }

  return {
    native: store,
    state,
    getters,
    mutations
  }
}
