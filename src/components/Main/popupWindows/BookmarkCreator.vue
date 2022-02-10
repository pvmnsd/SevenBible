<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Закладка</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <q-editor
        :model-value="editorHtml"
        square
        flat
        toolbar-bg="grey"
        content-class="fit"
        class="flex d-column grow-1 overflow-hidden"
        :toolbar="[['bold', 'italic', 'strike', 'underline']]"
      />
      <q-separator/>
      <div class="container q-gutter-y-sm">
        <BibleVerses
          style="max-height: 150px"
          :verses="verses"
          class="shadow-4 rounded-borders overlay"
        />
        <div class="flex justify-around">
          <UIButton :icon="'cancel'"/>
          <UIButton :icon="'done'"/>
        </div>
      </div>

    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script>
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody";
import useSevenBible from "src/hooks/useSevenBible";
import {onMounted, ref} from "vue";
import BibleVerses from "components/Main/BibleVerses";
import UIButton from "components/UI/UIButton";

export default {
  setup(props, {emit}) {
    const close = () => emit('close')
    const {bible: {value: bible}} = useSevenBible()
    const verses = ref(null)
    const editorHtml = ref('')

    const getVersesText = async () => {
      const settings = {
        filename: bible.fileName,
        bookNumber: bible.bookNumber,
        chapterNumber: bible.chapterNumber,
        selectedVerseFrom: props.selectedVerseFrom,
        selectedVerseTo: props.selectedVerseTo
      }
      verses.value = await window.api.bible.getVerses(settings)
    }
    onMounted(() => getVersesText())
    return {
      close,
      verses,
      editorHtml
    }
  },
  props: {
    selectedVerseFrom: Number,
    selectedVerseTo: [Number, undefined]
  },
  components: {
    UIButton,
    BibleVerses,
    UIModalWindowBody,
    UIModalWindowHeader,
    UIModalWindow
  }
}
</script>
