<template>
  <q-page class='bg-background'>
    <q-tabs
      v-model='tab'
      inline-label
      class='bg-secondary-bg tabs'
    >
      <q-tab name='appearance' icon='brush' label='Внешний вид'/>
      <q-tab name='modules' icon='library_books' label='Модули'/>
      <q-tab name='languages' icon='language' label='Язык'/>
      <q-tab name='mouse' icon='mouse' label='Взаимодействие'/>
    </q-tabs>
    <q-separator color='separator'/>

    <q-tab-panels v-model='tab'>

      <q-tab-panel name='appearance' class='bg-background'>
        <div class='text-h4 q-mb-md'>Внешний вид</div>

        <div class="q-pa-lg">
          <q-option-group
            @update:model-value="updateTheme"
            :model-value='programSettings.theme'
            :options="themes"
            color="info"
          />
        </div>
        <q-separator color='separator'/>

      </q-tab-panel>

    </q-tab-panels>

  </q-page>
</template>

<script>

import { useStore } from 'vuex'
import {computed, inject, ref} from 'vue'
import { useQuasar } from 'quasar'

export default {

  setup() {
    const id = inject('id')

    const tab = ref('appearance')
    const themes = [
      {
        label: 'Светлая',
        value: 'light'
      },
      {
        label: 'Темная',
        value: 'dark'
      }
    ]
    const $q = useQuasar()
    const store = useStore()
    const programSettings = computed(() => store.getters['settings/programSettings'])
    const changeProgramSettings = (settings) => store.commit('settings/changeProgramSettings', settings)

    const updateTheme = value => {
      changeProgramSettings({ id,  key: 'theme', value })
      $q.dark.set(value === 'dark')
      document.body.setAttribute('theme', value)
    }
    return {
      updateTheme,
      themes,
      tab,
      programSettings
    }
  }
}
</script>
