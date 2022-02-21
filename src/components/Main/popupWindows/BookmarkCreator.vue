<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Закладка {{ bookShortName }} {{ bible.chapterNumber }}:{{ convertedVerses }}</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <div class="container fit flex d-column">
        <q-select
          v-model="selectedCategory"
          :options="categoriesList"
        />
        <textarea
          maxlength="1000"
          :placeholder="$t('noteToBookmark')"
          class="fit overlay reset shadow-4 rounded-borders container"
          v-model="bookmark.description"
          v-focus.next
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

<script setup lang="ts">
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader.vue";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import useSevenBible from "src/hooks/useSevenBible";
import {computed, onMounted, ref} from "vue";
import BibleVerses from "components/Main/BibleVerses.vue";
import UIButton from "components/UI/UIButton.vue";
import {MakeBookmarkArgs} from "app/types/api-args/systemArgs";
import {createDateString} from "src/helpers";
import {notify} from "src/wrappers/notify";
import {useI18n} from "vue-i18n";
import {Bookmark} from "app/types/bookmark";

interface Props {
  _bookmark: Bookmark,
  isEditMode?: boolean,
  categoryNameToDeleteIn?: string
}

let props = withDefaults(defineProps<Props>(), {
  isEditMode: false
})

const emit = defineEmits(['close'])

const {
  bible: {value: bible},
  bookShortName,
  bibleModuleInfo: {value: info},
  bookmarks,
  updateBibleWindows
} = useSevenBible()

const {_bookmark, isEditMode, categoryNameToDeleteIn} = props

const bookmark = ref<Bookmark>({
  bookNumber: bible.bookNumber,
  startChapterNumber: bible.chapterNumber,
  endChapterNumber: bible.chapterNumber,
  endVerseNumber: _bookmark.endVerseNumber ?? _bookmark.startVerseNumber,
  description: '',
  isForRussianNumbering: Boolean.parse(info.russian_numbering),
  ..._bookmark
})


const close = () => emit('close')
const verses = ref<[]>()

const getVersesText = async () => {
  const settings = {
    filename: bible.fileName,
    bookNumber: bible.bookNumber,
    chapterNumber: bible.chapterNumber,
    selectedVerseFrom: bookmark.value.startVerseNumber,
    selectedVerseTo: bookmark.value.endVerseNumber
  }
  verses.value = await window.api.bible.getVerses(settings)
}

onMounted(() => {
  getVersesText()
})

const {t} = useI18n()

const convertedVerses = computed(() => {
  return !bookmark.value.endVerseNumber || bookmark.value.endVerseNumber === bookmark.value.startVerseNumber
    ? bookmark.value.startVerseNumber : `${bookmark.value.startVerseNumber}-${bookmark.value.endVerseNumber}`
})

const categoriesList = bookmarks.bookmarkCategories.value.map(category => category.name)
const selectedCategory = ref(categoriesList[0])

const makeBookmark = async () => {
  if (!bookmark.value.startVerseNumber) return
  const settings: MakeBookmarkArgs = {
    categoryName: selectedCategory.value,
    bookmark: {...bookmark.value}
  }
  const date = createDateString()
  if (isEditMode)
    settings.bookmark.dateModified = date
  else {
    settings.bookmark.dateCreated = date
    settings.bookmark.dateModified = date
  }
  close()
  if (isEditMode) {
    await bookmarks.editBookmark(settings, {
      categoryName: categoryNameToDeleteIn!,
      bookmark: {..._bookmark}
    })
    notify.showInfo(t('bookmarkWasEdited'))
  } else {
    await bookmarks.addBookmark(settings)
    notify.showInfo(t('bookmarkWasCreated'))
  }
  updateBibleWindows()
}

</script>
