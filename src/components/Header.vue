<template>
  <div>
    <q-header class="bg-secondary-bg text-text">
      <q-bar
        class="q-electron-drag"
      >
        <q-icon name="book"/>
        <div class="">Seven Bible</div>
        <q-space/>
        <div class="q-gutter-x-sm">
          <q-btn dense flat icon="menu" @click="$emit('toggleDrawer')"/>
          <q-btn dense flat icon="note_add" class="q-mr-sm" @click="openNewWindow"/>

          <q-btn dense flat icon="minimize" @click="minimize"/>
          <q-btn dense flat icon="crop_square" @click="toggleMaximize"/>
          <q-btn dense flat icon="close" @click="closeApp"/>
        </div>

      </q-bar>
      <q-separator color='separator'/>
    </q-header>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {useStore} from "vuex";

export default defineComponent({
  setup() {
    const minimize = () => window.myWindowAPI.minimize()
    const toggleMaximize = () => window.myWindowAPI.toggleMaximize()
    const closeApp = () => window.myWindowAPI.close()

    const store = useStore()
    const openNewWindow = () => store.commit('settings/openNewWindow')

    return {minimize, toggleMaximize, closeApp, openNewWindow}
  }
})
</script>
