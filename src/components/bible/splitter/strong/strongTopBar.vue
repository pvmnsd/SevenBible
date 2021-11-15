<template>
    <div class='row no-wrap bg-secondary-bg col-auto'>
      <div class='bible-module col-auto'>
        <ModuleSelector
            :file-name="strongFileName"
            module="strong"
            :path="['modules', 'dictionaries', 'strong']"
        />
      </div>
      <q-separator vertical color='separator'/>
      <div class='bible-module col'>
        <q-btn :label='strongNumbersToString' flat size='13px' class='fit'/>
      </div>

      <q-separator vertical color='separator'/>
      <div class='bible-search col-auto'>
        <q-btn
            @click="$parent.$parent.$parent.$emit('toggleWindow', 'strongSearcher', true)"
            flat
            size='13px'
            icon='manage_search'
            class='full-width full-height'
        />
      </div>
      <q-separator vertical color='separator'/>
      <div class='bible-ref col-auto'>
        <q-btn icon='more_vert' flat size='13px' class='fit'></q-btn>
      </div>

      <q-separator vertical color='separator'/>
      <div class='bible-ref col-auto'>
        <q-btn
            icon='close'
            flat size='13px'
            class='fit'
            @click="changeModuleState({ id, key: 'strong', settings: {show: false}})">
        </q-btn>
      </div>
    </div>
    <q-separator color='separator'/>
</template>
<script>
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {computed, defineComponent, inject} from 'vue'
import {useStore} from 'vuex'

export default defineComponent({
  components: {ModuleSelector},
  props: {
    strongNumbers: Array,
    strongFileName: {
      type: String,
      defaults: '...'
    }
  },
  setup(props){
    const id = inject('id')
    const store = useStore()
    return {
      id,
      changeModuleState: (settings) => store.commit('settings/changeModuleState', settings),
      strongNumbersToString: computed(() => props.strongNumbers.join(' '))
    }
  },
})
</script>
