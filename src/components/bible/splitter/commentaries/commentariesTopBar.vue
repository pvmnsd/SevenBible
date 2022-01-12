<template>
  <UIButtonset>
    <ModuleSelector
      module="commentaries"
      :path="['modules', 'commentaries']"
      :file-name="commentariesFileName"
    />
    <q-separator vertical/>

    <q-btn
      class="grow-1"
      :label="bookShortName + ' ' + chapterNumber"
      no-caps
      unelevated
      no-wrap
      stretch
    />
    <q-separator vertical/>

    <q-btn
      icon="close"
      unelevated
      stretch
      @click="toggleModuleState('commentaries', 'show')"
    />
  </UIButtonset>
  <q-separator/>
</template>
<script>
import ModuleSelector from "components/bible/ModuleSelector"
import {useStore} from "vuex"
import {inject} from 'vue'
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel";
import UIButtonset from "components/UI/UIButtonset";

export default {
  setup() {
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
  components: {UIButtonset, ModuleSelector}
}
</script>
