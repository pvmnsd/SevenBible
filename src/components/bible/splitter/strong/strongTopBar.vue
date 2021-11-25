<template>
  <div
    @wheel.prevent="horizontalScrollOnWheel($event, $refs.topBar)"
    ref="topBar"
    class='row no-wrap bg-secondary-bg col-auto scroll-x'
  >

    <ModuleSelector
      :file-name="strongFileName"
      module="strong"
      :path="['modules', 'dictionaries', 'strong']"
    />
    <q-separator vertical color='separator'/>

    <q-btn
      :label='strongNumbersToString'
      stretch
      unelevated
      no-wrap
      size='13px'
      class='col overflow-hidden'
    />
    <q-separator vertical color='separator'/>

    <q-btn
      @click="$parent.$parent.$parent.$parent.$parent.$emit('toggleWindow', 'strongSearcher', true)"
      stretch
      unelevated
      size='13px'
      icon='manage_search'
      class='col-auto'
    />
    <q-separator vertical color='separator'/>

    <q-btn
      icon='more_vert'
      stretch
      unelevated
      size='13px'
      class='col-auto'
    />
    <q-separator vertical color='separator'/>

    <q-btn
      icon='close'
      stretch
      unelevated
      size='13px'
      class='col-auto'
      @click="changeModuleState({ id, key: 'strong', settings: {show: false}})"
    />

  </div>
  <q-separator color='separator'/>
</template>
<script>
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {computed, defineComponent, inject, ref} from 'vue'
import {useStore} from 'vuex'
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel"

export default defineComponent({
  components: {ModuleSelector},
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

    return {
      horizontalScrollOnWheel: horizontalScrollOnWheel,
      id,
      changeModuleState: (settings) => store.commit('settings/changeModuleState', settings),
      strongNumbersToString: computed(() => props.strongNumbers.join(' '))
    }
  },
})
</script>
