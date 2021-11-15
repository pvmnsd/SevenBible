<template>
  <q-layout
    view="hHh Lpr ffr"
    :theme="programSettings.theme"
  >
    <Header @toggleDrawer="toggleDrawer"/>

    <Drawer
      :drawer="drawer"
    />

    <q-page-container>
      <router-view />
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
    const programSettings = computed(() => useStore().getters["settings/programSettings"])
    onMounted(() => document.body.setAttribute('theme', programSettings.value.theme))

    return {drawer, toggleDrawer, programSettings}
  }
})
</script>
