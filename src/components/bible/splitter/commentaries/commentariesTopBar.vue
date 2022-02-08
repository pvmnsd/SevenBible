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
      @click="close"
    />
  </UIButtonset>
  <q-separator/>
</template>
<script>
import ModuleSelector from "components/bible/ModuleSelector"
import useStore from "src/hooks/useStore";
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel";
import UIButtonset from "components/UI/UIButtonset";
import useSevenBible from "src/hooks/useSevenBible";

export default {
  setup() {
    const {id} = useSevenBible()
    const store = useStore()
    const close = () => store.state.set(`workPlace.${id}.commentaries.show`, false)

    return {close, horizontalScrollOnWheel}
  },
  props: {
    commentariesFileName: String,
    bookShortName: String,
    chapterNumber: Number
  },
  components: {UIButtonset, ModuleSelector}
}
</script>
