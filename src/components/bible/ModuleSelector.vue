<template>
  <q-btn-dropdown
    :label='fileName'
    class='without-icon'
    stretch
    unelevated
    no-caps
    @before-show="loadStrongModules"
  >
    <q-list>
      <div v-for='(fileName, idx) in modules' :key='idx'>
        <q-item clickable v-close-popup @click='onModuleClick(fileName)'>
          <q-item-section>
            <q-item-label>{{ fileName }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name='book' color='gray'/>
          </q-item-section>
        </q-item>

        <q-separator class='separator'/>
      </div>
    </q-list>
  </q-btn-dropdown>
</template>

<script>

import {defineComponent, inject, ref} from "vue"
import { useStore } from "vuex"

export default defineComponent({
  setup(props){
    const id = inject('id')
    const modules = ref([])
    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const loadStrongModules = () => {
      const ph = window.system.pathResolve(props.path)
      if (ph.length) { modules.value = window.system.fsReaddirSync(ph).map(module => module.split('.')[0]) } else console.log('Отсутствуют модули ... ')
    }
    const onModuleClick = fileName => changeModuleState({ id, key: props.module, settings: { fileName: fileName } })

    return {onModuleClick, loadStrongModules, modules}
  },
  props: {
    fileName: String,
    module: String,
    path: {
      type: Array,
      required: true
    }
  },
})
</script>
