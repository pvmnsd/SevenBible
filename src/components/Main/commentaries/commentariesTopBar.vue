<template>
  <UIButtonset>
    <ModuleSelector
      module="commentaries"
      :path="['modules', 'commentaries']"
      :file-name="props.commentariesFileName"
    />
    <q-separator vertical/>

    <q-btn
      class="grow-1"
      :label="props.bookShortName + ' ' + props.chapterNumber"
      no-caps
      unelevated
      no-wrap
      stretch
    />
    <q-separator vertical/>

    <UIButton
      :icon="Icons.Close"
      @click="close"
    />
  </UIButtonset>
  <q-separator/>
</template>

<script setup lang="ts">
import ModuleSelector from "components/Main/popupWindows/ModuleSelector.vue"
import useStore from "src/hooks/useStore";
import UIButtonset from "components/UI/UIButtonset.vue";
import useSevenBible from "src/hooks/useSevenBible";
import UIButton from "components/UI/UIButton.vue";
import {Icons} from "src/types/icons";

interface Props {
  commentariesFileName: string,
  bookShortName: string,
  chapterNumber: number
}

const props = defineProps<Props>()

const {id} = useSevenBible()
const store = useStore()
const close = () => store.state.set(`workPlace.${id}.commentaries.show`, false)

</script>
