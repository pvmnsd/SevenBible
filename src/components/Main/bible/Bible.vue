<template>

  <q-menu
    ref="htmlPopup"
    transition-show="jump-down"
    transition-hide="jump-up"
    no-parent-event
    :target="htmlPopupTarget"
  >
    <div class="q-pa-md" v-html="htmlPopupText"/>
  </q-menu>

  <q-menu
    ref="verseNumberPopup"
    transition-show="jump-down"
    transition-hide="jump-up"
    no-parent-event
    auto-close
    :target="verseNumberPopupTarget"
  >
    <q-list>
      <q-item
        v-for="(item, i) in verseMenuItems"
        :key="i"
        clickable
        @click="item.callback"
      >
        <q-item-section v-t="item.title"/>
      </q-item>
    </q-list>
  </q-menu>

  <q-menu
    ref="versePopup"
    auto-close
    transition-show="jump-down"
    transition-hide="jump-up"
    no-parent-event
    :target="versePopupTarget"
  >
    <q-list>
      <q-item
        v-for="(item, i) in versePopupOptions"
        :key="i"
        clickable
      >
        <q-item-section
          v-t="(item.label)"
          @click="item.callback"
        />
      </q-item>
    </q-list>
  </q-menu>

  <UIWorkPlaceWindow>
    <UIWorkPlaceWindowHeader>
      <BibleTopBar
        :bible-file-name="bible.fileName"
        :book-number="bible.bookNumber"
        :chapter-number="bible.chapterNumber"
        :selected-verses="selectedVerses"
        @clearSelectedVerses="clearSelectedVerses"
        @copyVerses="copyVerses(selectedVerses)"
      />
    </UIWorkPlaceWindowHeader>

    <UIWorkPlaceWindowBody>
      <UIError v-if="bibleError.show" v-text="bibleError.message"/>
      <div v-else
           class='bible-text scroll-container container'
           :style="{fontSize: bible.view.fontSize + 'px'}"
           :showBookName="bible.view.showBookName.toString()"
           :showChapterNumber="bible.view.showChapterNumber.toString()"
           :showSubheadings="bible.view.showSubheadings"
           :showCommentaries="bible.view.showCommentaries"
           :showVerseNumber="bible.view.showVerseNumber.toString()"
           :showJesusWords="bible.view.showJesusWords.toString()"
           :showStrongNumbers="bible.view.showStrongNumbers.toString()"
           :showParagraphs="bible.view.showParagraphs.toString()"
           :showContinuousText="bible.view.showContinuousText.toString()"
           :showDreamy='bible.view.showDreamy.toString()'
      >

        <headings
          :chapter-string="chapterString"
          :chapter-number="bible.chapterNumber"
          :book-full-name="bookFullName"
          :book-number="bible.bookNumber"
          :bible-file-name="bible.fileName"
        />

        <div class='verses'>
          <div
            v-for='(verse, i) in chapter'
            :key='i'
            class="flex verse-block"
            @click.stop="onVerseClick($event, {chapterNumber: bible.chapterNumber, verseNumber: i + 1})"
            @contextmenu.stop="onVerseContextmenu"
          >
            <span
              class='verse grow-1'
              :class="{'selected-verse' : selectedVerses.includes(i + 1)}"
            >

          <span
            v-if="verse.story"
            class="h"
          >
            {{ verse.story }}
          </span>

              <template
                v-if="verse.subheadings"
              >
            <span
              class="h"
              v-for="(subheading, index) in verse.subheadings"
              :style="{direction: subheading.direction}"
              :key="'A' + index"
              v-html="subheading.subheading"
            />
              </template>

              <span>
          <span
            class="verse-number no-selectable text-caption"
            @click.stop="onVerseNumberClick($event, i + 1)"
            @contextmenu.stop="onVerseNumberContextMenu($event, i + 1)"
            v-text="i + 1"
          />
            <span
              class="verse-text"
              v-html='verse.text'
            />
          </span>

              <span
                class="commentary q-pl-xs"
                v-for="(commentary, idx) in verse.commentaries"
                :key="'B' + idx"
                @click="({target}) => {
              htmlPopupTarget = target
              htmlPopupText = commentary.text
              $refs.htmlPopup.toggle()
            }"
              >
            {{ commentary.moduleName }}
          </span>

            </span>

            <div
              class="bookmarks"
              v-if="verse.bookmarkCategories"
              @click="onBookmarkBlockClick(verse.bookmarkCategories, i + 1)"
            >
              <template
                v-for="(category, categoryName, i) of verse.bookmarkCategories"
                :key="i"
                class="bookmark-category"
              >
                <div
                  v-for="({}, i) in category.bookmarks"
                  :key="i"
                  class="bookmark bookmark-block"
                  :style="{backgroundColor: category.backgroundColor}"
                />
              </template>
            </div>

            <span class="checkbox" :class="{visible: selectedVerses.includes(i + 1)}">
              <q-checkbox
                @click="onSelectorClick(i + 1)"
                v-touch-hold.mouse="() => onSelectorHold(i + 1)"
                :model-value="selectedVerses.includes(i + 1)"
                size="1.7em"
              />
            </span>

          </div>

        </div>
      </div>
    </UIWorkPlaceWindowBody>

  </UIWorkPlaceWindow>
</template>

<script lang="ts">
import Headings from 'components/Main/bible/headings.vue'
import ContextMenu from "components/Main/bible/ContextMenu.vue";
import useBibleEvents from "src/hooks/useBibleEvents";
import useVerseNumber from "src/hooks/useVerseNumber";
import UIWorkPlaceWindow from "components/UI/WorkPlaceWindow/UIWorkPlaceWindow.vue";
import UIWorkPlaceWindowHeader from "components/UI/WorkPlaceWindow/UIWorkPlaceWindowHeader.vue";
import UIWorkPlaceWindowBody from "components/UI/WorkPlaceWindow/UIWorkPlaceWindowBody.vue";
import BibleTopBar from "components/Main/bible/bibleTopBar.vue";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";
import {onMounted, watch, computed, ref} from "vue";
import useChapter from "src/hooks/useChapter";
import useFootnotes from "src/hooks/useFootnotes";
import useVerseSelector from "src/hooks/useVerseSelector";
import useVerse from "src/hooks/useVerse";
import {clearTags, cropString} from "src/helpers";
import {convertVerses} from "src/helpers/verseSelector";
import {notify} from "src/wrappers/notify";
import {useI18n} from "vue-i18n";
import UIError from "components/UI/UIError.vue";
import {BookNumbers} from "app/types/bookNumbers";
import useBookmarkBlock from "src/hooks/useBookmarkBlock";
import UIDraggableDialog from "components/UIDraggableDialog.vue";

export default {
  setup() {
    const {
      id,
      refString,
      viewParamsRequiringRerender,
      bibleTextKey,
      bible,
      bibleModuleInfo: info,
      bookShortName,
      bookFullName,
      bibleWindowsUpdates
    } = useSevenBible()
    const store = useStore()

    const bibleError = ref({
      show: false,
      message: ''
    })
    const {chapter, getChapter} = useChapter({bible, bibleError})
    const {footnotes, getFootNotes} = useFootnotes(bible)


    watch([
      refString,
      viewParamsRequiringRerender,
      bibleTextKey,
      bibleWindowsUpdates,
      () => bible.value.fileName
    ], async () => {
      await getChapter()
      await getFootNotes()
    })


    const {
      onVerseContextmenu,
      versePopup,
      versePopupOptions,
      versePopupTarget
    } = useVerse()

    const {
      onVerseClick,
      htmlPopup,
      htmlPopupText,
      htmlPopupTarget
    } = useBibleEvents(id, store, footnotes)

    const {
      onBookmarkBlockClick
    } = useBookmarkBlock()

    const {
      selectedVerses,
      onSelectorClick,
      onSelectorHold,
      clearSelectedVerses
    } = useVerseSelector()

    const {t} = useI18n()

    const copyVerses = (verses: number[]) => {
      const ref = `${bookShortName?.value} ${bible.value.chapterNumber}:${convertVerses(verses)}`
      let text = ''
      text += '['
      verses.forEach(verseNumber => {
        const html = chapter?.value![verseNumber - 1].text;
        text += clearTags(html)
      })
      text += ']'
      text += `\n${ref}`
      navigator.clipboard.writeText(text)
      notify.showInfo(`${t('textCopied')}: "${cropString(text, 20)}"`)
    }

    const {
      verseMenuItems,
      verseNumberPopup,
      verseNumberPopupTarget,
      onVerseNumberClick,
      onVerseNumberContextMenu,
      openCrossreferencesSearcher,
      openTranslationsComparator,
      openBookmarkCreator,
    } = useVerseNumber({copyVerses})


    onMounted(() => {
      getChapter()
      getFootNotes()
    });

    const localizedChapterName = t('chapterString')
    const chapterString = computed(() => {
      return info.value?.chapter_string_ps && bible.value.bookNumber === BookNumbers.Ps
        ? info.value?.chapter_string_ps
        : info.value?.chapter_string_nt && bible.value.bookNumber >= BookNumbers.Mat
          ? info.value?.chapter_string_nt
          : info.value?.chapter_string_ot && bible.value.bookNumber < BookNumbers.Mat
            ? info.value?.chapter_string_ot
            : info.value?.chapter_string
              ? info.value?.chapter_string
              : localizedChapterName
    })


    // const copyText = async () => {
    //   let text = await navigator.clipboard.readText()
    //   text = text.replace(/\n/g, ' ')
    //   navigator.clipboard.writeText(text)
    // }

    return {
      bibleError,
      bible,
      chapter,
      htmlPopup,
      htmlPopupText,
      htmlPopupTarget,
      verseNumberPopup,
      verseMenuItems,
      verseNumberPopupTarget,
      bookFullName,
      bookShortName,
      chapterString,

      onVerseContextmenu,
      versePopup,
      versePopupOptions,
      versePopupTarget,

      selectedVerses,
      onSelectorClick,
      onSelectorHold,
      clearSelectedVerses,

      onVerseClick,
      onVerseNumberClick,
      onVerseNumberContextMenu,
      openCrossreferencesSearcher,
      openTranslationsComparator,
      openBookmarkCreator,
      copyVerses,

      onBookmarkBlockClick
    }
  },
  components: {
    UIDraggableDialog,
    UIError,
    UIWorkPlaceWindowBody,
    UIWorkPlaceWindowHeader,
    UIWorkPlaceWindow,
    ContextMenu,
    Headings,
    BibleTopBar
  }
}
</script>
