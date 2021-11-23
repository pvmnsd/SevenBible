<template>
  <div class='fit transition absolute-top bg-background column'>
      <div class='row q-pa-md'>
        <q-btn
          flat
          round
          icon='arrow_back'
          @click="$emit('toggleWindow', 'subheadingsSettings', false)"
        />
        <div class='flex direction-center items-center text-bold q-px-xs'>
          Настройки отображения подзаголовков
        </div>
        <q-space />
        <q-btn flat round icon='payments' />
        <q-btn flat round icon='more_vert' />
      </div>

      <q-separator color='blue' style='height: 2px' />
      <q-scroll-area class="q-pa-md col q-gutter-y-md">
        <div>
          <q-checkbox
            :model-value="subheadings.embededOverwriteOthers"
            label="Встроенные в модуль Библии подзаголовки заменяют все остальные подзаголовки"
            @update:model-value="changeSubheadingsSetting('embededOverwriteOthers', $event)"
          />
        </div>

        <q-separator color="separator" class="q-my-sm"/>

        <span>Отмеченные ниже модули подзаголовков будут использоваться для всех модулей Библии</span>

        <div v-for="(moduleName, idx) in subheadingsModules" :key="idx">
          <q-checkbox
            :label="moduleName"
            :model-value="!!subheadings.activeModules.includes(moduleName)"
            @update:model-value="addNewActiveSubheadingModule(moduleName, $event)"
          />
        </div>

      </q-scroll-area>

  </div>
</template>

<script>
import {useStore} from 'vuex'
import {defineComponent, inject, onMounted, ref} from 'vue'

export default defineComponent({
  setup(){
    const id = inject('id')

    const store = useStore()
    const changeModuleStateView = settings => store.commit('settings/changeModuleStateView', settings)
    const changeActiveModules = settings => store.commit('settings/changeActiveModules', settings)

    const subheadingsModules = ref([])
    onMounted(() => {
      subheadingsModules.value = window.system.fsReaddirSync(['modules', 'subheadings']).map(moduleName => moduleName.match(/.+?(?=\.)/g)[0])
    })

    const changeSubheadingsSetting = (name1, value) => changeModuleStateView({ id, key: 'bible', name: 'subheadings', name1, value })
    const addNewActiveSubheadingModule = (name, value) => changeActiveModules({ id, key: 'subheadings', name, value })

    return {subheadingsModules, changeSubheadingsSetting, addNewActiveSubheadingModule}
  },
  props: {subheadings: Object}
})
</script>
