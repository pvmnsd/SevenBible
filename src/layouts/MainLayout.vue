<template>
  <q-layout
    view="hHh Lpr ffr"
    :theme="programSettings.theme"
    :style="font"
  >
    <Header @toggleDrawer="toggleDrawer"/>

    <Drawer
      :drawer="drawer"
    />

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {computed, defineComponent, ref, onMounted} from 'vue'
import {useStore} from "vuex"
import Header from "components/Header"
import Drawer from "components/Drawer"

export default defineComponent({
  name: 'MainLayout',

  components: {
    Header,
    Drawer
  },
  emits: ['toggleDrawer'],
  setup() {
    const drawer = ref(false)
    const toggleDrawer = () => drawer.value = !drawer.value

    const store = useStore()
    const programSettings = computed(() => store.getters["settings/programSettings"])

    const font = computed(() => ({fontFamily: `${programSettings.value.font}, sans-serif`}))
    onMounted(() => {
      document.body.setAttribute('theme', programSettings.value.theme)
    })


    const stringify = state => JSON.stringify(state, null, 2)
    const saveProgramSettings = (state) => window.electron.saveProgramSettings(stringify(state))

    const changeProgramSettings = settings => store.commit('settings/changeProgramSettings', settings)

    const saveProgramState = () => {
      changeProgramSettings({win: window.myWindowAPI.getWindowBounds()})
      saveProgramSettings(store.state.settings)
    }

    setInterval(() => {
      saveProgramState()
      console.log('saved')
    }, 60000 * 5)

    window.electron.onCloseApp(async () => {
      await saveProgramState()
      window.electron.closeApp()
    })

    return {drawer, toggleDrawer, programSettings, font}
  }
})
</script>
