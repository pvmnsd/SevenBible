<template>
  <UIButtonDropdown
    :label='fileName'
    @before-show="loadStrongModules"
  >
    <q-list>
      <div v-for='(fileName, idx) in modules' :key='idx'>
        <q-item clickable v-close-popup @click='onModuleClick(fileName)'>
          <q-item-section>
            <q-item-label>{{ fileName }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name='book'/>
          </q-item-section>
        </q-item>

        <q-separator class='separator'/>
      </div>
    </q-list>
  </UIButtonDropdown>
</template>

<script>

import {defineComponent, ref} from "vue"
import useStore from "src/hooks/useStore";
import useSevenBible from "src/hooks/useSevenBible";
import UIButtonDropdown from "components/UI/UIButtonDropdown";

export default defineComponent({
  components: {UIButtonDropdown},
  setup(props) {
    const {id} = useSevenBible()
    const modules = ref([])
    const store = useStore()

    const loadStrongModules = () => {
      if (props.path.length) {
        modules.value = window.api.system.fsReaddirSync(props.path)
          .map(module => module.split('.')[0])
      } else console.log('Отсутствуют модули ... ')
    }
    const onModuleClick = newFilename => {
      const oldFilename = store.state.get(`workPlace.${id}.${props.module}.fileName`)
      if (newFilename !== oldFilename) {
        store.state.set(`workPlace.${id}.${props.module}.fileName`, newFilename)
      }
    }

    return {
      onModuleClick,
      loadStrongModules,
      modules
    }
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
