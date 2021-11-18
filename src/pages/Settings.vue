<template>
  <q-page class='bg-background'>
    <q-tabs
      v-model='tab'
      inline-label
      class='bg-secondary-bg tabs'
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.name"
        :name='tab.name'
        :icon='tab.icon'
        :label='tab.label'
      />

    </q-tabs>
    <q-separator color='separator'/>

    <q-tab-panels v-model='tab'>

      <q-tab-panel
        v-for="tab in [tabs[0]]"
        :key="tab.name"
        :name='tab.name'
      >
        <component
          :is="`${tab.name}Tab`"
          :active-tab-label="activeTabLabel"
        />
      </q-tab-panel>

    </q-tab-panels>

  </q-page>
</template>

<script>

import {computed, ref} from 'vue'
import AppearanceTab from "components/Settings/appearanceTab"

export default {
  setup() {

    const tabs = [
      {
        name: 'appearance',
        label: 'Внешний вид',
        icon: 'brush'
      },
      {
        name: 'modules',
        label: 'Модули',
        icon: 'library_books'
      },
      {
        name: 'mouse',
        label: 'Взаимодействие',
        icon: 'mouse'
      },
      {
        name: 'language',
        label: 'Язык',
        icon: 'language'
      },
    ]
    const tab = ref('appearance')

    const activeTabLabel = computed(() => tabs.find(currTab => currTab.name = tab.value).label)


    return {
      tab,
      tabs,
      activeTabLabel,
    }
  },
  components: {AppearanceTab},
}
</script>
