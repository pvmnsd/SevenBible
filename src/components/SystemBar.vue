<template>
    <q-bar
      class="q-electron-drag"
    >
      <q-icon name="book"/>
      <div class="">Seven Bible</div>
      <q-space/>
      <div class="q-gutter-x-sm">
        <q-btn dense flat icon="menu" @click="$emit('toggle-drawer')"/>
        <q-btn
          :disable="activeWorkPlaces.length > 3"
          dense
          flat
          icon="note_add"
          class="q-mr-sm"
          @click="openNewWorkPlace"
        />

        <q-btn dense flat icon="minimize" @click="minimize"/>
        <q-btn dense flat icon="crop_square" @click="toggleMaximize"/>
        <q-btn dense flat icon="close" @click="close"/>
      </div>

    </q-bar>
    <q-separator/>
</template>

<script>
import useStore from "src/hooks/useStore";
import {computed} from "vue";

export default {
	setup() {
    const store = useStore()
    const activeWorkPlaces = computed(() => store.getters.getActiveWorkPlaces().indexes)

    const minimize = () => window.electron.minimize()
    const toggleMaximize = () => window.electron.toggleMaximize()
    const close = () => window.electron.close()
    const openNewWorkPlace = () => store.native.commit('settings/openNewWorkPlace')

    return {
      minimize,
      toggleMaximize,
      close,
      openNewWorkPlace,
      activeWorkPlaces
    }
	},
  emits: ['toggle-drawer']
}
</script>
