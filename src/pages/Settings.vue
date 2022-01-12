<template>
  <div class="fit flex d-column">
    <q-tabs
      v-model='tab'
      inline-label
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.name"
        :name='tab.name'
        :icon='tab.icon'
        :label='t(tab.label)'
      />

    </q-tabs>
    <q-separator/>

    <q-tab-panels v-model='tab' class="col">

      <q-tab-panel
        v-for="tab in [tabs[0]]"
        :key="tab.name"
        :name='tab.name'
        class="overflow-hidden no-padding"
      >
        <component
          :is="`${tab.name}`"
        />
      </q-tab-panel>

    </q-tab-panels>
  </div>

</template>

<script>

import {computed, ref } from 'vue'
import GeneralTab from "components/Settings/generalTab"
import {useI18n} from 'vue-i18n'

export default {
  setup() {

    const {t} = useI18n()

    const tabs = [
      {
        name: 'generalTab',
        label: 'generalTab',
        icon: 'settings'
      },
      {
        name: 'themeEditorTab',
        label: 'themeEditorTab',
        icon: 'brush'
      }
    ]
    const tab = ref('generalTab')

    const activeTabLabel = computed(() => tabs.find(currTab => currTab.name = tab.value).label)


    return {
      tab,
      tabs,
      activeTabLabel,
      t
    }
  },
  components: {GeneralTab},
}
</script>
