<template>
  <UIModalWindow>
    <UIModalWindowHeader>
      <q-btn
        flat
        round
        icon='arrow_back'
        @click="close"
      />
      <div class='flex direction-center items-center text-bold q-px-xs'>
        Настройки отображения комментариев
      </div>
      <q-space/>
      <q-btn disable flat round icon='more_vert'/>
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

<script>
import useStore from "src/hooks/useStore";
import {onMounted, ref} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import useSevenBible from "src/hooks/useSevenBible";

export default {
  components: {UIModalWindowHeader, UIModalWindow},
  setup() {
    const {id, transitions, bibleTextKey} = useSevenBible()

    const store = useStore()

    const commentariesModules = ref([])
    const toggleCommentariesModule = (moduleName, value) =>
      store.mutations.toggleCommentariesModule(id, moduleName, value)
    const commentaries = store.state.get(`workPlace.${id}.bible.view.commentaries`)
    close = () => {
      bibleTextKey.value++
      transitions.commentariesSettings = false
    }
    onMounted(() => commentariesModules.value =
      window.system.fsReaddirSync(['modules', 'commentaries'])
        .map(moduleName => moduleName
          .match(/.+?(?=\.)/g)[0])
    )
    return {
      commentaries,
      commentariesModules,
      toggleCommentariesModule,
      close
    }
  }
}
</script>
