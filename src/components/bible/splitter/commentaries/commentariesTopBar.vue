<template>
  <div
    @wheel.prevent="horizontalScrollOnWheel($event, $refs.topBar)"
    ref="topBar"
    class='row no-wrap col-auto bg-secondary-bg scroll-x'
  >

    <ModuleSelector
      module="commentaries"
      :path="['modules', 'commentaries']"
      :file-name="commentariesFileName"
    />
    <q-separator vertical color="separator"/>

    <q-btn
      class="col overflow-hidden"
      :label="bookShortName + ' ' + chapterNumber"
      no-caps
      unelevated
      no-wrap
      stretch
    />
    <q-separator vertical color="separator"/>

    <q-btn
      class="col-auto"
      icon="close"
      unelevated
      stretch
      @click="toggleModuleState('commentaries', 'show')"
    />
  </div>
  <q-separator color='separator'/>
</template>
<script>
import ModuleSelector from "components/bible/ModuleSelector"
import {useStore} from "vuex"
import { inject } from 'vue'
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel";

export default {
  setup(){
    const id = inject('id')
    const store = useStore()
    const toggleModuleState = (key, name) => store.commit('settings/toggleModuleState', {id, key, name})

    return {toggleModuleState, horizontalScrollOnWheel}
  },
  props: {
    commentariesFileName: String,
    bookShortName: String,
    chapterNumber: Number
  },
  components: {ModuleSelector}
}
</script>
