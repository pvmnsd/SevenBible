<template>
  <div class='full-height overflow-hidden'>
    <Splitpanes
      :dbl-click-splitter="false"
    >
      <pane
        v-for="(id) in indexes"
        :key="id"
        min-size="10"
        class="relative-position overflow-auto"
      >
        <WorkPlace :id="id"/>
      </pane>

    </Splitpanes>
  </div>
</template>

<script>
import {computed, provide} from "vue"
import useStore from "src/hooks/useStore";
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import WorkPlace from "../components/Main/WorkPlace";


export default {
  setup() {
    const store = useStore()
    const activeWorkPlaces = computed(() => store.getters.getActiveWorkPlaces())
    const indexes = computed(() => activeWorkPlaces.value.indexes)
    provide('activeWorkPlaces', activeWorkPlaces)

    return {
      indexes
    }
  },
  components: {
    Splitpanes,
    Pane,
    WorkPlace
  }
}
</script>

