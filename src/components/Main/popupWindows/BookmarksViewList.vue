<template>
  <UIModalWindow :transparent="transparent" @close="close">
    <UIModalWindowBody class="justify-center items-center overflow-hidden">

      <q-card style="max-width: 50%" class="overflow-hidden flex d-column q-ma-lg">
        <q-card-section>
          {{ $t('bookmarks') }} {{ bookShortName }} {{ chapterNumber }}:{{ verseNumber }}
        </q-card-section>
        <q-separator/>

        <div class="overlay">
          <template v-for="(categoryName, i) in categoriesNames" :key="i">
            <div v-for="(bookmark, i) in bookmarkCategories[categoryName].bookmarks" :key="i">
              <q-separator/>
              <q-card-section class="flex q-gutter-x-sm">

                <div class="bookmark-block" :style="bookmarkBlockColor(bookmarkCategories[categoryName])"/>

                <div class="flex d-column justify-around">
                  <span class="text-h6">{{ categoryName }}</span>
                  <div>{{ bookmark.description.length ? bookmark.description : '...' }}</div>
                </div>

                <q-space/>

                <div class="flex d-column justify-around q-gutter-y-sm">
                  <q-btn :icon="Icons.Delete" round dense @click="onDeleteClick(categoryName, bookmark)"/>
                  <q-btn :icon="Icons.Edit" round dense @click="onEditClick(categoryName,bookmark)"/>
                </div>

              </q-card-section>

              <q-card-section class="flex">
                <div v-if="bookmark.dateCreated" v-text="new Date(bookmark.dateCreated).toLocaleString()"/>
                <q-space class="q-px-sm"/>
                <div
                  v-if="bookmark.dateModified && bookmark.dateCreated !== bookmark.dateModified"
                  v-text="new Date(bookmark.dateModified).toLocaleString()"
                />
              </q-card-section>

            </div>
          </template>
        </div>

      </q-card>

    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script setup lang="ts">
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import useSevenBible from "src/hooks/useSevenBible";
import {ChapterBookmarkCategories} from "src/types/chapter";
import {Bookmark, BookmarkCategory} from "app/types/bookmark";
import {isEqual} from "src/helpers";
import {Icons} from "src/types/icons";


const props = defineProps<{
  transparent: boolean,
  bookmarkCategories: ChapterBookmarkCategories,
  verseNumber: number
}>()

const emit = defineEmits(['close'])

const categoriesNames = Object.keys(props.bookmarkCategories)
const close = () => emit('close')
const {bible: {value: {chapterNumber}}, bookShortName, popup, bookmarks, updateBibleWindows} = useSevenBible()

const onEditClick = (categoryName: string, bookmark: Bookmark) => {
  popup.showBookmarkCreator({
    _bookmark: {...bookmark},
    categoryNameToDeleteIn: categoryName,
    isEditMode: true
  })
}
const onDeleteClick = async (categoryName: string, bookmark: Bookmark) => {
  await bookmarks.deleteBookmark(categoryName, bookmark)
  updateBibleWindows()
  // eslint-disable-next-line vue/no-mutating-props
  const currentBookmarks = props.bookmarkCategories[categoryName].bookmarks
  const bookmarkIndex = currentBookmarks.findIndex((_bookmark: any) => isEqual(_bookmark, bookmark))
  currentBookmarks.splice(bookmarkIndex, 1)
  if (!currentBookmarks.length) {
    categoriesNames.remove(categoryName)
    if (!categoriesNames.length)
      close()
  }
}

const bookmarkBlockColor =  (category: BookmarkCategory) => `background-color: ${category.backgroundColor}`


</script>
