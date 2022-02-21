<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Настройки отображения комментариев</template>
      <q-btn disable flat round :icon='Icons.Dots'/>
    </UIModalWindowHeader>

    <div class="overlay container">

      <span>Отмеченные ниже модули комментариев будут использоваться для всех модулей Библии</span>

      <div v-for="(moduleName, idx) in commentariesModules" :key="idx">
        <q-checkbox
          :label="moduleName"
          :model-value="!!commentaries.activeModules.includes(moduleName)"
          @update:model-value="toggleCommentariesModule(moduleName, $event)"
        />
      </div>

    </div>

  </UIModalWindow>
</template>

<script setup>
import useStore from "src/hooks/useStore";
import {onMounted, ref} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import useSevenBible from "src/hooks/useSevenBible";
import {Icons} from "src/types/icons";

const emit = defineEmits(['close'])

const {id, bibleTextKey} = useSevenBible()
const store = useStore()

const commentariesModules = ref([])
const toggleCommentariesModule = (moduleName, value) =>
  store.mutations.toggleCommentariesModule(id, moduleName, value)
const commentaries = store.state.get(`workPlace.${id}.bible.view.commentaries`)
close = () => {
  bibleTextKey.value++
  emit('close')
}
onMounted(() => {
  commentariesModules.value =
    window.api.system.fsReaddirSync(['modules', 'commentaries'])
      .map(moduleName => moduleName
        .match(/.+?(?=\.)/g)[0])
})

</script>
