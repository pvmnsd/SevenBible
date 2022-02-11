<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Закладка {{ bookShortName }} {{ bible.chapterNumber }}:{{ convertedVerses }}</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <textarea
        maxlength="1000"
        placeholder="rsdafdsa fsdfdsf"
        ref="textarea"
        class="grow-1 overlay reset"
      />
      <q-separator/>
      <div class="container q-gutter-y-sm">
        <BibleVerses
          style="max-height: 150px"
          :verses="verses"
          class="shadow-4 rounded-borders overlay"
        />
        <div class="flex justify-around">
          <UIButton :tooltip="$t('cancel')" :icon="'cancel'" @click="close"/>
          <UIButton :tooltip="$t('accept')" :icon="'done'" @click="makeBookmark"/>
        </div>
      </div>

    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script lang="ts">
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader.vue";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import useSevenBible from "src/hooks/useSevenBible";
import {computed, onMounted, ref, defineComponent, Ref} from "vue";
import BibleVerses from "components/Main/BibleVerses.vue";
import UIButton from "components/UI/UIButton.vue";
import {MakeBookmarkArgs} from "app/types/api-args/makeBookmarkArgs";

export default defineComponent({
  setup(props, {emit}) {
    const close = () => emit('close')
    const {bible: {value: bible}, bookShortName, bibleModuleInfo: {value: info}} = useSevenBible()
    const verses = ref<[]>()

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
    const textarea = ref<HTMLTextAreaElement>()

    onMounted(() => {
      getVersesText()
      setTimeout(() => {
        textarea.value!.focus()
      })
    })

    const convertedVerses = computed(() => {
      return !props.selectedVerseTo || props.selectedVerseTo === props.selectedVerseFrom
      ? props.selectedVerseFrom : `${props.selectedVerseFrom}-${props.selectedVerseTo}`
    })

    const makeBookmark = () => {
      if (!props.selectedVerseFrom) return
      const description = textarea.value?.value ?? ''
      const date = new Date().toString()

      const settings: MakeBookmarkArgs = {
        categoryName: '[Без категории]',
        bookmark: {
          bookNumber: bible.bookNumber,
          dateCreated: date,
          dateModified: date,
          description,
          endChapterNumber: bible.chapterNumber,
          endVerseNumber: props.selectedVerseTo ?? props.selectedVerseFrom,
          isForRussianNumbering: Boolean.parse(info.russian_numbering),
          startChapterNumber: bible.chapterNumber,
          startVerseNumber: props.selectedVerseFrom,
        }
      }
      console.log(settings)
      window.api.system.makeBookmark(settings)
    }
    return {
      close,
      verses,
      bible,
      bookShortName,
      convertedVerses,
      makeBookmark,
      textarea
    }
  },
  props: {
    selectedVerseFrom: Number,
    selectedVerseTo: Number
  },
  components: {
    UIButton,
    BibleVerses,
    UIModalWindowBody,
    UIModalWindowHeader,
    UIModalWindow
  }
})
</script>
