<template>
  <q-btn-dropdown
    :label='fileName'
    class='without-icon'
    stretch
    unelevated
    no-caps
    no-wrap
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
  </q-btn-dropdown>
</template>

<script>

import {defineComponent, ref} from "vue"
import useStore from "src/hooks/useStore";
import useSevenBible from "src/hooks/useSevenBible";

export default defineComponent({
  setup(props) {
    const {id} = useSevenBible()
    const modules = ref([])
    const store = useStore()

    const loadStrongModules = () => {
      if (props.path.length) {
        modules.value = window.system.fsReaddirSync(props.path)
          .map(module => module.split('.')[0])
      } else console.log('Отсутствуют модули ... ')
    }
    const onModuleClick = fileName => store.state.set(`workPlace.${id}.${props.module}.fileName`, fileName)

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
