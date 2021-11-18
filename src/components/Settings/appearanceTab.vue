<template>
    <div class='text-h4 q-mb-md'>{{ activeTabLabel }}</div>

    <div class="q-pa-lg">
      <q-option-group
        @update:model-value="updateTheme"
        :model-value='programSettings.theme'
        :options="themes"
        color="info"
      />
    </div>
    <q-separator color='separator'/>

    <q-select
      :model-value="programSettings.font"
      @update:model-value="setNewFont"
      :options="fonts"
      transition-show="jump-up"
      transition-hide="jump-up"
      style="width: 300px"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section :style="{fontFamily: scope.label}">
            {{ scope.label }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
</template>

<script>
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import {computed, inject, onMounted, ref} from "vue";

export default {
  setup(){
    const id = inject('id')

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

    const setNewFont = fontName => {
      store.commit('settings/changeProgramSettings', {key: 'font', value: fontName})
    }

    const fonts = ref([])
    onMounted(async () => {
      console.log('sdf')
      fonts.value = await window.system.getAllFonts()
    })

    return {
      setNewFont,
      updateTheme,
      programSettings,
      fonts,
      themes
    }

  },
  props: {
    activeTabName: String,
    activeTabLabel: String
  }
}
</script>
