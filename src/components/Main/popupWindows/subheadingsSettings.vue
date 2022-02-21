<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Настройки отображения подзаголовков</template>
      <q-btn disable flat round :icon='Icons.Dots'/>
    </UIModalWindowHeader>

    <div class="overlay container">
      <div>
        <q-checkbox
          :model-value="subheadings.embededOverwriteOthers"
          label="Встроенные в модуль Библии подзаголовки заменяют все остальные подзаголовки"
          @update:model-value="changeSubheadingsSetting('embededOverwriteOthers', $event)"
        />
      </div>

      <q-separator class="q-my-sm"/>

      <span>Отмеченные ниже модули подзаголовков будут использоваться для всех модулей Библии</span>

      <div v-for="(moduleName, idx) in subheadingsModulesList" :key="idx">
        <q-checkbox
          :label="moduleName"
          :model-value="!!subheadings.activeModules.includes(moduleName)"
          @update:model-value="addNewActiveSubheadingModule(moduleName, $event)"
        />
      </div>

    </div>

  </UIModalWindow>
</template>

<script setup>
import {onMounted, ref} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";
import {Icons} from "src/types/icons";

const emit = defineEmits(['close'])
const {id, bibleTextKey} = useSevenBible()
const store = useStore()


const close = () => {
  bibleTextKey.value++
  emit('close')
}

const subheadingsModulesList = ref([])

onMounted(() => {
  subheadingsModulesList.value =
    window.api.system.fsReaddirSync(['modules', 'subheadings'])
      .map(moduleName => moduleName
        .match(/.+?(?=\.)/g)[0])
})
const changeSubheadingsSetting = (name, value) =>
  store.state.set(`workPlace.${id}.bible.view.subheadings.${name}`, value)

const addNewActiveSubheadingModule = (moduleName, value) => {
  store.mutations.toggleSubheadingsModule(id, moduleName, value)
}

const subheadings = store.state.get(`workPlace.${id}.bible.view.subheadings`)

</script>
