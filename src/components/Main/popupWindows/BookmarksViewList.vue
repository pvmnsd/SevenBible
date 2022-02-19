<template>
  <UIModalWindow :transparent="transparent">
    <UIModalWindowBody class="justify-center items-center overflow-hidden">
      <q-card style="max-width: 50%" class="overflow-hidden flex d-column q-ma-lg">
        <q-card-section>
          {{ $t('bookmarks') }} {{ bookShortName }} {{ chapterNumber }}
        </q-card-section>
        <q-separator/>

        <div class="overlay">
          <template v-for="(categoryName, i) in categoriesNames" :key="i">
            <div v-for="(bookmark, i) in bookmarkCategories[categoryName].bookmarks" :key="i">
              <q-separator/>
              <q-card-section class="flex q-gutter-x-sm">

                <div class="bookmark-block"/>

                <div class="flex d-column justify-around">
                  <span class="text-h6">{{ categoryName }}</span>
                  <div>{{ bookmark.description.length ? bookmark.description : '...' }}</div>
                </div>
                <q-space/>
                <div class="flex d-column justify-around q-gutter-y-sm">
                  <q-btn icon="delete" round dense/>
                  <q-btn icon="edit" round dense/>
                  <q-btn icon="share" round dense/>
                </div>

              </q-card-section>
              <q-card-section class="flex">
                <div v-if="bookmark.dateCreated" v-text="new Date(bookmark.dateCreated).toLocaleString()"/>
                <q-space/>
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

<script lang="ts">
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import useSevenBible from "src/hooks/useSevenBible";
import {PropType} from "vue";
import {ChapterBookmarkCategories} from "src/types/chapter";

export default {
  components: {UIModalWindowBody, UIModalWindow},

  setup(props: any) {
    const {bible: {value: {chapterNumber}}, bookShortName} = useSevenBible()

    return {
      bookShortName,
      chapterNumber,
      categoriesNames: Object.keys(props.bookmarkCategories)
    }
  },
  props: {
    transparent: Boolean,
    bookmarkCategories: Object as PropType<ChapterBookmarkCategories>
  }
}
</script>
