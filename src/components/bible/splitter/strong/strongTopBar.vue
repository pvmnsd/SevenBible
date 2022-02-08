<template>
  <UIButtonset>
    <ModuleSelector
      :file-name="strongFileName"
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

    <q-btn
      @click="openStrongSearcher"
      stretch
      unelevated
      icon='manage_search'
    />
    <q-separator vertical/>

    <q-btn
      icon='more_vert'
      stretch
      unelevated
    />
    <q-separator vertical/>

    <q-btn
      icon='close'
      stretch
      unelevated
      @click="close"
    />
  </UIButtonset>

  <q-separator/>
</template>
<script>
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {computed, defineComponent} from 'vue'
import useStore from "src/hooks/useStore";
import UIButtonset from "components/UI/UIButtonset";
import useSevenBible from "src/hooks/useSevenBible";

export default defineComponent({
  components: {UIButtonset, ModuleSelector},
  props: {
    strongNumbers: Array,
    strongFileName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = useStore()
    const {id, popup} = useSevenBible()
    
    const openStrongSearcher = async () => {
      const ref = await popup.showStrongSearcher()
      store.state.setBibleRef(id, ref)
    }

    return {
      openStrongSearcher,
      id,
      close: () => store.state.set(`workPlace.${id}.strong.show`, false),
      strongNumbersToString: computed(() => props.strongNumbers.join(' '))
    }
  },
})
</script>
