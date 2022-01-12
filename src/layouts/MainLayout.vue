<template>
  <div :style="font" class="flex d-column fit">

    <SystemBar @toggleDrawer="visibleRight = !visibleRight"/>
    <div class="flex col">

      <div class="layout-main fit min-w-0">
        <router-view/>
      </div>

      <SideMenu :visibleRight="visibleRight"/>
    </div>

  </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue'
import {useStore} from "vuex"
import SystemBar from 'components/SystemBar.vue'
import SideMenu from 'components/SideMenu.vue'
import useTheme from "src/hooks/useTheme";

export default {
  setup() {
    const visibleRight = ref(true)

    const store = useStore()
    const app = computed(() => store.getters["settings/app"])

    const font = computed(() => ({fontFamily: `${app.value.appearance.font}, sans-serif`}))

    const {setTheme} = useTheme()
    setTheme(app.value.appearance.theme)

    const stringify = state => JSON.stringify(state, null, 2)
    const saveProgramSettings = (state) => window.electron.saveProgramSettings(stringify(state))

    const changeAppSettings = settings => store.commit('settings/changeAppSettings', settings)

    const saveProgramState = async () => {
      const bounds = await window.electron.getWindowBounds()
      changeAppSettings({win: bounds})
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

    return {
      visibleRight,
      app,
      font
    }
  },
  components: {
    SystemBar,
    SideMenu
  }
}
</script>
