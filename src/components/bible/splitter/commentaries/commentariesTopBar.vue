<template>
  <div class='row no-wrap bg-secondary-bg'>

    <ModuleSelector
      module="commentaries"
      :path="['modules', 'commentaries']"
      :file-name="commentariesFileName"
    />
    <q-separator vertical color="separator"/>

    <q-btn
      class="col"
      :label="bookShortName + ' ' + chapterNumber"
      no-caps
      unelevated
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
export default {
  setup(){
    const id = inject('id')
    const store = useStore()
    const toggleModuleState = (key, name) => store.commit('settings/toggleModuleState', {id, key, name})

    return {toggleModuleState}
  },
  props: {
    commentariesFileName: String,
    bookShortName: String,
    chapterNumber: Number
  },
  components: {ModuleSelector}
}
</script>
