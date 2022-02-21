<template>
  <UIButtonset>
    <ModuleSelector
      :file-name="props.strongFileName"
      module="strong"
      :path="['modules', 'dictionaries', 'strong']"
    />
    <q-separator vertical/>

    <q-btn
      :label='strongNumbersToString'
      stretch
      unelevated
      no-wrap
      class="grow-1"
    />
    <q-separator vertical/>

    <UIButton
      @click="openStrongSearcher"
      :icon='Icons.Search'
    />
    <q-separator vertical/>

    <UIButton
      :icon='Icons.Dots'
    />
    <q-separator vertical/>

    <UIButton
      :icon='Icons.Close'
      @click="close"
    />
  </UIButtonset>

  <q-separator/>
</template>
<script setup lang="ts">
import ModuleSelector from 'components/Main/popupWindows/ModuleSelector.vue'
import {computed} from 'vue'
import useStore from "src/hooks/useStore";
import UIButtonset from "components/UI/UIButtonset.vue";
import useSevenBible from "src/hooks/useSevenBible";
import {Icons} from "src/types/icons";
import UIButton from "components/UI/UIButton.vue";

interface Props {
  strongNumbers: number[],
  strongFileName: string
}
const props = withDefaults(defineProps<Props>(), {strongFileName: ''})

const store = useStore()
const {id, popup} = useSevenBible()

const openStrongSearcher = async () => {
  const ref = await popup.showStrongSearcher({})
  store.state.setBibleRef(id, ref)
}
const close = () => store.state.set(`workPlace.${id}.strong.show`, false)
const strongNumbersToString = computed(() => props.strongNumbers.join(' '))

</script>
