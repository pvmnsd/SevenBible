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
      @click="transitions.strongSearcher = true"
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
      @click="changeModuleState({ id, key: 'strong', settings: {show: false}})"
    />
  </UIButtonset>

  <q-separator/>
</template>
<script>
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {computed, defineComponent, inject, ref} from 'vue'
import {useStore} from 'vuex'
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel"
import UIButtonset from "components/UI/UIButtonset";
import useSevenBible from "src/hooks/useSevenBible";

export default defineComponent({
  components: {UIButtonset, ModuleSelector},
  props: {
    strongNumbers: Array,
    strongFileName: {
      type: String,
      defaults: '...'
    }
  },
  setup(props) {
    const id = inject('id')
    const store = useStore()
    const {transitions} = useSevenBible()
    return {
      transitions,
      horizontalScrollOnWheel: horizontalScrollOnWheel,
      id,
      changeModuleState: (settings) => store.commit('settings/changeModuleState', settings),
      strongNumbersToString: computed(() => props.strongNumbers.join(' '))
    }
  },
})
</script>
