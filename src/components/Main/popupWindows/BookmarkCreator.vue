<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Закладка {{ bookShortName }} {{ bible.chapterNumber }}:{{ convertedVerses }}</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <div class="container fit">
      <textarea
        maxlength="1000"
        :placeholder="$t('noteToBookmark')"
        ref="textarea"
        class="fit overlay reset shadow-4 rounded-borders container"
      />
      </div>
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
import {computed, onMounted, ref, defineComponent} from "vue";
import BibleVerses from "components/Main/BibleVerses.vue";
import UIButton from "components/UI/UIButton.vue";
import {MakeBookmarkArgs} from "app/types/api-args/makeBookmarkArgs";
import {createDateString} from "src/helpers";
import {notify} from "src/wrappers/notify";
import {useI18n} from "vue-i18n";

export default defineComponent({
  setup(props, {emit}) {
    const close = () => emit('close')
    const {
      bible: {value: bible},
      bookShortName,
      bibleModuleInfo: {value: info},
      bookmarks
    } = useSevenBible()
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

    const {t} = useI18n()

    const makeBookmark = async () => {
      if (!props.selectedVerseFrom) return
      const description = textarea.value?.value ?? ''

      const settings: MakeBookmarkArgs = {
        categoryName: '[Без категории]',
        bookmark: {
          bookNumber: bible.bookNumber,
          description,
          endChapterNumber: bible.chapterNumber,
          endVerseNumber: props.selectedVerseTo ?? props.selectedVerseFrom,
          isForRussianNumbering: Boolean.parse(info.russian_numbering),
          startChapterNumber: bible.chapterNumber,
          startVerseNumber: props.selectedVerseFrom,
        }
      }
      const date = createDateString()
      if (props.isEditMode)
        settings.bookmark.dateModified = date
      else {
        settings.bookmark.dateCreated = date
        settings.bookmark.dateModified = date
      }
      await window.api.system.makeBookmark(settings)
      bookmarks.fetchBookmarks()
      close()
      notify.showInfo(t('bookmarkWasCreated'))
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
    selectedVerseTo: Number,
    isEditMode: {
      type: Boolean,
      default: false
    }
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
