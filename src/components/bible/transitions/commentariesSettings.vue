<template>
  <div class='fit transition absolute-top bg-background column'>
    <div class='row q-pa-md'>
      <q-btn
        flat
        round
        icon='arrow_back'
        @click="$emit('toggleWindow', 'commentariesSettings', false)"
      />
      <div class='flex direction-center items-center text-bold q-px-xs'>
        Настройки отображения комментариев
      </div>
      <q-space/>
      <q-btn flat round icon='payments'/>
      <q-btn flat round icon='more_vert'/>
    </div>

    <q-separator color='blue' style='height: 2px'/>

    <q-scroll-area class="q-pa-md col q-gutter-y-md">

      <span>Отмеченные ниже модули комментариев будут использоваться для всех модулей Библии</span>

      <div v-for="(moduleName, idx) in commentariesModules" :key="idx">
        <q-checkbox
          :label="moduleName"
          :model-value="!!commentaries.activeModules.includes(moduleName)"
          @update:model-value="addNewActiveCommentaryModule(moduleName, $event)"
        />
      </div>

    </q-scroll-area>

  </div>
</template>

<script>
import {useStore} from 'vuex'
import {defineComponent, inject, onMounted, ref} from "vue";

export default defineComponent({
  setup(){
    const id = inject('id')

    const store = useStore()
    const changeActiveModules = settings => store.commit('settings/changeActiveModules', settings)

    const addNewActiveCommentaryModule = (name, value) => changeActiveModules({ id, key: 'commentaries', name, value })

    const commentariesModules = ref([])
    onMounted(() => {
      commentariesModules.value = window.system.fsReaddirSync(['modules', 'commentaries']).map(moduleName => moduleName.match(/.+?(?=\.)/g)[0])
    })

    return{ commentariesModules, addNewActiveCommentaryModule }
  },
  props: {commentaries: Object}
})
</script>
