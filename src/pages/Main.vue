<template>
  <q-page class='bg-background column'>
    <Splitpanes
      class="col column"
      :dbl-click-splitter="false"
    >
          <pane
            v-for="(id, i) in activeBibleModulesIndexes"
            :key="id"
            min-size="10"
            :class="i === 1 ? 'col' : 'col-auto'"
            class="relative-position column"
          >
            <Bible :id="id"/>
          </pane>

    </Splitpanes>
  </q-page>
</template>

<script>
import {computed, defineComponent, provide} from "vue"
import Bible from "components/Bible"
import {useStore} from "vuex"
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'


export default defineComponent({
  setup() {
    const store = useStore()
    const activeBibleModules = computed(() => store.getters["settings/bibleActiveModules"])

    const activeBibleModulesIndexes = computed(() => activeBibleModules.value.map(curr => curr.id))
    provide('activeBibleModulesIndexes', activeBibleModulesIndexes)

    return {activeBibleModulesIndexes}
  },
  components: {Splitpanes, Pane, Bible}
})
</script>

