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
        clickable
        @click="openCrossreferencesSearcher"
      >
        <q-item-section>Искать перекрестные ссылки</q-item-section>
      </q-item>

      <q-item
        clickable
        @click="openTranslationsComparator"
      >
        <q-item-section>Сравнить переводы</q-item-section>
      </q-item>
    </q-list>
  </q-menu>

  <UIWorkPlaceWindow>
    <UIWorkPlaceWindowHeader>
      <BibleTopBar
        :bible-file-name="bible.fileName"
        :book-number="bible.bookNumber"
        :chapter-number="bible.chapterNumber"
        :book-short-name="bookShortName"
        :ref-string="refString"
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
          :introduction-string="info.introduction_string"
          :chapter-number="bible.chapterNumber"
          :description="info.description"
          :detailed-info="info.detailed_info"
          :book-full-name="bookFullName"
          :book-number="bible.bookNumber"
          :ref-string="refString"
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
            class='verse'
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
            @contextmenu="onVerseNumberContextMenu($event, i + 1)"
            v-text="i + 1"
          />
            <span class="text" v-html='verse.text'/>
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
import {onMounted, watch, computed, onBeforeUnmount} from "vue";
import useChapter from "src/hooks/useChapter";
import useFootnotes from "src/hooks/useFootnotes";

export default {
  setup(props) {
    const {id, transitions} = useSevenBible()
    const store = useStore()
    const {bibleTextKey} = useSevenBible()
    const {chapter, getChapter, bookFullName, bookShortName} = useChapter(props)
    const {footnotes, getFootNotes} = useFootnotes(props)

    watch([
      () => props.refString,
      () => props.viewParamsRequiringRerender,
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
    } = useBibleEvents(id, store, footnotes, props)

    const {
      verseNumberPopup,
      verseNumberPopupTarget,
      onVerseNumberClick,
      onVerseNumberContextMenu,
      openCrossreferencesSearcher,
      openTranslationsComparator
    } = useVerseNumber()


    onMounted(() => {
      getChapter()
      getFootNotes()
    });

    const chapterString = computed(() => {
      return props.info.chapter_string_ps &&
      props.bible.bookNumber === 230
        ? props.info.chapter_string_ps
        : props.info.chapter_string_nt &&
        props.bible.bookNumber >= 470
          ? props.info.chapter_string_nt
          : props.info.chapter_string_ot &&
          props.bible.bookNumber < 470
            ? props.info.chapter_string_ot
            : props.info.chapter_string
              ? props.info.chapter_string
              : "Глава";
    })


    // const copyText = async () => {
    //   let text = await navigator.clipboard.readText()
    //   text = text.replace(/\n/g, ' ')
    //   navigator.clipboard.writeText(text)
    // }


    return {
      transitions,
      chapter,
      htmlPopup,
      htmlPopupText,
      htmlPopupTarget,
      verseNumberPopup,
      verseNumberPopupTarget,
      bookFullName,
      bookShortName,
      chapterString,
      onVerseClick,
      onVerseNumberClick,
      onVerseNumberContextMenu,
      openCrossreferencesSearcher,
      openTranslationsComparator
    }
  },
  components: {
    UIWorkPlaceWindowBody,
    UIWorkPlaceWindowHeader,
    UIWorkPlaceWindow,
    ContextMenu,
    Headings,
    BibleTopBar
  },
  props: {
    bible: Object,
    info: Object,
    refString: String,
    viewParamsRequiringRerender: Number,
    strongNumbersPrefix: String
  }
}
</script>
