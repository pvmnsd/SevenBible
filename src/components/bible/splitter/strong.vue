<template>
    <StrongTopBar
      :strong-numbers="strongNumbers"
      :strong-file-name="strongFileName"
    />

    <q-scroll-area class='col'>
      <div class='q-px-xl q-py-sm q-gutter-sm'>

        <div v-for='(number, key, id) in strongNumbersInfo' :key='id'>
          <div class='text-bold text-green' v-show='strongNumbers.length > 1'>{{ key }}</div>
          <div v-html='number.definition'></div>
          <q-separator class='q-my-xs' color='separator'/>
          <div v-if="number.cognate.length" class='cognate row'>
            Однокоренные:
            <div style='margin: 0 2px' v-for='(cognate, i) in number.cognate' :key='i'>
              <a :href="'S:' + cognate">{{ cognate }}</a>
            </div>
          </div>
        </div>

      </div>
    </q-scroll-area>
</template>
<script>
import StrongTopBar from './strong/strongTopBar.vue'
import {ref, defineComponent, computed, onMounted, watch, inject} from "vue"
import {useStore} from "vuex";

export default defineComponent({
  props: {
    strongNumbers: {
      type: Array,
      required: true
    },
    strongFileName: String
  },
  components: { StrongTopBar },
  setup(props){
    const id = inject('id')
    const store = useStore()
    const changeModuleStatePointly = (moduleName, key, value) =>  store.commit('settings/changeModuleStatePointly',{id, moduleName, key, value})

    if (!props.strongFileName || !props.strongFileName.length)
      changeModuleStatePointly('strong', 'fileName', window.system.getFirstExistsModuleName(['modules', 'dictionaries', 'strong']))

    const strongNumbersInfo = ref({})
    const searchInfo = async () => {
      const settings = {
        strongNumbers: [...props.strongNumbers],
        strongFileName: props.strongFileName
      }
      strongNumbersInfo.value = await window.electron.invoke('get-strong-numbers-info', settings)
    }

    onMounted(() => searchInfo())

    const strongNumbersAndFileNameToString = computed(() => props.strongFileName + props.strongNumbers.join(''))
    watch(strongNumbersAndFileNameToString, () => searchInfo())

    return{strongNumbersInfo}
  }
})
</script>
