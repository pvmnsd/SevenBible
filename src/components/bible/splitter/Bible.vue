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

  <UIWorkPlaceWindow>
    <UIWorkPlaceWindowHeader>
      <BibleTopBar
        :bible-file-name="bible.fileName"
        :book-number="bible.bookNumber"
        :chapter-number="bible.chapterNumber"
        :selected-verses="selectedVerses"
        @clearSelectedVerses="clearSelectedVerses"
      />
    </UIWorkPlaceWindowHeader>

    <UIWorkPlaceWindowBody>
      <div
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

        <div
          class='verses'
          @click.stop="onVerseClick"
          @copy="copyText"
        >
          <div
            v-for='(verse, i) in chapter'
            :key='i'
            class="flex verse-block"
          >
            <div
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
            class="verse-num no-selectable text-caption"
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

<script>
import Headings from 'components/bible/splitter/headings.vue'
import ContextMenu from "components/bible/splitter/bibleText/ContextMenu";
import useBibleEvents from "src/hooks/useBibleEvents";
import useVerseNumber from "src/hooks/useVerseNumber";
import UIWorkPlaceWindow from "components/UI/WorkPlaceWindow/UIWorkPlaceWindow";
import UIWorkPlaceWindowHeader from "components/UI/WorkPlaceWindow/UIWorkPlaceWindowHeader";
import UIWorkPlaceWindowBody from "components/UI/WorkPlaceWindow/UIWorkPlaceWindowBody";
import BibleTopBar from "components/bible/bibleTopBar";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";
import {onMounted, watch, computed, ref} from "vue";
import useChapter from "src/hooks/useChapter";
import useFootnotes from "src/hooks/useFootnotes";
import {WorkModes} from "src/objects";
import useVerseSelector from "src/hooks/useVerseSelector";

export default {
  setup() {
    const {
      id,
      refString,
      viewParamsRequiringRerender,
      bible,
      bibleModuleInfo: info
    } = useSevenBible()
    const store = useStore()
    const {bibleTextKey} = useSevenBible()
    const {chapter, getChapter, bookFullName, bookShortName} = useChapter(bible)
    const {footnotes, getFootNotes} = useFootnotes(bible)

    let workMode = ref(WorkModes.standard)

    watch([
      refString,
      viewParamsRequiringRerender,
      bibleTextKey
    ], async () => {
      await getChapter()
      await getFootNotes()
    })

    const {
      onVerseClick,
      htmlPopup,
      htmlPopupText,
      htmlPopupTarget
    } = useBibleEvents(id, store, footnotes)

    const {
      selectedVerses,
      onSelectorClick,
      onSelectorHold,
      clearSelectedVerses
    } = useVerseSelector()

    const {
      verseMenuItems,
      verseNumberPopup,
      verseNumberPopupTarget,
      onVerseNumberClick,
      onVerseNumberContextMenu,
      openCrossreferencesSearcher,
      openTranslationsComparator,
      openBookmarkCreator,
    } = useVerseNumber()


    onMounted(() => {
      getChapter()
      getFootNotes()
    });

    const chapterString = computed(() => {
      return info.value.chapter_string_ps &&
      bible.value.bookNumber === 230
        ? info.value.chapter_string_ps
        : info.value.chapter_string_nt &&
        bible.value.bookNumber >= 470
          ? info.value.chapter_string_nt
          : info.value.chapter_string_ot &&
          bible.value.bookNumber < 470
            ? info.value.chapter_string_ot
            : info.value.chapter_string
              ? info.value.chapter_string
              : "Глава";
    })


    // const copyText = async () => {
    //   let text = await navigator.clipboard.readText()
    //   text = text.replace(/\n/g, ' ')
    //   navigator.clipboard.writeText(text)
    // }

    return {
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

      selectedVerses,
      onSelectorClick,
      onSelectorHold,
      clearSelectedVerses,

      onVerseClick,
      onVerseNumberClick,
      onVerseNumberContextMenu,
      openCrossreferencesSearcher,
      openTranslationsComparator,
      openBookmarkCreator
    }
  },
  components: {
    UIWorkPlaceWindowBody,
    UIWorkPlaceWindowHeader,
    UIWorkPlaceWindow,
    ContextMenu,
    Headings,
    BibleTopBar
  }
}
</script>
