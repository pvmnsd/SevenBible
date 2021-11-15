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
      @click="closeCommentariesWindow"
    />
  </div>
  <q-separator color='separator'/>
</template>
<script>
import closeModule from "src/hooks/closeModule"
import ModuleSelector from "components/bible/ModuleSelector";
import {useStore} from "vuex";
import { inject } from 'vue'
export default {
  setup(){
    const id = inject('id')
    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const closeCommentariesWindow = () => {
      closeModule(changeModuleState, id, 'commentaries')
    }
    return {closeCommentariesWindow}
  },
  props: {
    commentariesFileName: String,
    bookShortName: String,
    chapterNumber: Number
  },
  components: {ModuleSelector}
}
</script>
