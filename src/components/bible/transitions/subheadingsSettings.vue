<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Настройки отображения подзаголовков</template>
      <q-btn disable flat round icon='more_vert'/>
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

<script>
import useSubheadingsSettings from "src/hooks/useSubheadingsSettings";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";

export default {
  components: {UIModalWindowHeader, UIModalWindow},
  setup() {

    const {
      subheadingsModulesList,
      close,
      changeSubheadingsSetting,
      addNewActiveSubheadingModule,
      subheadings
    } = useSubheadingsSettings()


    return {
      subheadingsModulesList,
      subheadings,
      changeSubheadingsSetting,
      addNewActiveSubheadingModule,
      close
    }
  }
}
</script>
