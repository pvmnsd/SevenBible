<template>
  <transition-group name='fade'>
    <book-selector
      v-if='bookSelector'
      :books-list='booksList'
      :book-file-name="bible.fileName"
      :chapter-number="bible.chapterNumber"
      :book-full-name="bible.bookFullName"
      :book-number="bible.bookNumber"
      :text-directions="textDirections"
      @toggleWindow='hideOrShowFullWindow'
    />

    <text-searcher
      v-if='bookSearcher'
      :book-file-name="bible.fileName"
      :books-list='booksList'
      @toggleWindow='hideOrShowFullWindow'
    />
    <strong-searcher
      v-if='strongSearcher'
      :book-file-name="bible.fileName"
      :strong-numbers='strong.strongNumbers'
      :books-list='booksList'
      :strong-file-name='strong.fileName'
      :fixed-strong-numbers-prefix="info.strong_numbers_prefix"
      @toggleWindow='hideOrShowFullWindow'
    />

    <crossreferences-searcher
      v-if='crossreferencesSearcher'
      :books-list='booksList'
      :book-file-name="bible.fileName"
      :book-number="bible.bookNumber"
      :chapter-number="bible.chapterNumber"
      :verse="chosenVerse"
      :book-short-name="bookNames.bookShortName"
      :text-directions="textDirections"
      @toggleWindow='hideOrShowFullWindow'
    />
    <translations-comparator
      v-if="translationsComparator"
      :chapter-number="bible.chapterNumber"
      :book-short-name="bookNames.bookShortName"
      :verse-number="chosenVerse"
      :book-number="bible.bookNumber"
      @toggleWindow="hideOrShowFullWindow"
    />

    <subheadings-settings
      v-if="subheadingsSettings"
      :subheadings="bible.view.subheadings"
      @toggleWindow="hideOrShowFullWindow"
    />

    <commentaries-settings
      v-if="commentariesSettings"
      :commentaries="bible.view.commentaries"
      @toggleWindow="hideOrShowFullWindow"
    />
  </transition-group>

  <bible-top-bar
    @toggleWindow='hideOrShowFullWindow'
    :book-file-name="bible.fileName"
    :book-number="bible.bookNumber"
    :chapter-number="bible.chapterNumber"
    :book-short-name="bookNames.bookShortName"
    :verse-number="bible.verseNumber"
    :ref-string="refString"
    :bible-view="bible.view"
    ref='topBar'
  />

  <splitter
    :ref-string="refString"
    :bible="bible"
    :strong="strong"
    :commentaries="commentaries"
    :top-bar-height="topBarHeight"
    :info="info"
    :book-names="bookNames"
    :strong-numbers-prefix="strongNumbersPrefix"
    :bible-text-key="bibleTextKey"
    :chapter-string="chapterString"
    :text-direction="bible.bookNumber >= 470 ? textDirections.nt : textDirections.ot"
    @toggleWindow="hideOrShowFullWindow"
    @setVerse="chosenVerse = $event"
  />
</template>

<script>
import {computed, ref, watch, onMounted, defineComponent, provide} from 'vue'
import {useStore} from 'vuex'
import BibleTopBar from 'components/bible/bibleTopBar.vue'
import BookSelector from 'components/bible/transitions/bookSelector.vue'
import textSearcher from 'components/bible/transitions/textSearcher.vue'
import StrongSearcher from 'components/bible/transitions/strongSearcher.vue'
import Splitter from 'components/bible/splitter/splitter.vue'
import CrossreferencesSearcher from 'components/bible/transitions/crossreferencesSearcher.vue'
import SubheadingsSettings from 'components/bible/transitions/subheadingsSettings.vue'
import CommentariesSettings from 'components/bible/transitions/commentariesSettings.vue'
import TranslationsComparator from 'components/bible/transitions/translationsComparator.vue'
import useBookNames from 'src/hooks/bookNamesFromNumber'
import useBookList from 'src/hooks/useBookList'

export default defineComponent({
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({id}) {
    provide('id', id)

    const store = useStore()
    const bible = computed(() => store.getters['settings/bible'](id))
    const strong = computed(() => store.getters['settings/strong'](id))
    const commentaries = computed(() => store.getters['settings/commentaries'](id))
    const bookFileName = computed(() => bible.value.fileName)

    const changeModuleStatePointly = (moduleName, key, value) => store.commit('settings/changeModuleStatePointly',{id, moduleName, key, value})
    if (!bookFileName.value || !bookFileName.value.length){
      const fileName = window.system.getFirstExistsModuleName(['modules', 'books'])
      changeModuleStatePointly('bible', 'fileName', fileName)
    }

    let booksList = ref([])
    let info = ref({})

    const fetchInfoAndBooksList = async () => {
      const data = await useBookList(bookFileName.value)
      booksList.value = data.booksList
      info.value = data.info
    }

    async function changeDbConnection(bookFileName, oldBookFileName) {
      const settings = {
        bookFileName,
        oldBookFileName,
        activeBibleModules: store.getters["settings/bibleActiveModules"].map(e => e.bookFileName)
      }
      await window.electron.invoke('change-db-connection', settings)
      fetchInfoAndBooksList()
    }

    watch(bookFileName, (bookFileName, oldBookFileName) => changeDbConnection(bookFileName, oldBookFileName))

    onMounted(() => {
      fetchInfoAndBooksList()
    })

    let topBarHeight = ref(38.58)


    let chosenVerse = ref(null)
    let bibleTextKey = ref(0)
    const transitions = {
      bookSelector: ref(false),
      bookSearcher: ref(false),
      strongSearcher: ref(false),
      crossreferencesSearcher: ref(false),
      translationsComparator: ref(false),
      subheadingsSettings: ref(false),
      commentariesSettings: ref(false)
    }

    const chapterString = computed(() => {
      return info.value.chapter_string_ps && bible.value.bookNumber === 230 ? info.value.chapter_string_ps
        : info.value.chapter_string_nt && bible.value.bookNumber >= 470 ? info.value.chapter_string_nt
          : info.value.chapter_string_ot && bible.value.bookNumber < 470 ? info.value.chapter_string_ot
            : info.value.chapter_string ? info.value.chapter_string
              : 'Глава'
    })


    const textDirections = computed(() => {
      return info.value.right_to_left === 'true' ? {
          nt: 'rtl',
          ot: 'rtl'
        }
        : info.value.right_to_left_nt === 'true' ? {
            nt: 'rtl',
            ot: 'ltr'
          }
          : info.value.right_to_left_ot === 'true' ? {
              nt: 'ltr',
              ot: 'rtl'
            }
            : {
              nt: 'ltr',
              ot: 'ltr'
            }
    })
    const bookNames = computed(() => booksList.value.length ? useBookNames(bible.value.bookNumber, booksList.value) : {})
    const refString = computed(() => {
      return bible.value.fileName + bible.value.bookNumber + bible.value.chapterNumber
    })

    const strongNumbersPrefix = computed(() => {
      if (info.value.strong_numbers_prefix) {
        return info.value.strong_numbers_prefix
      } else {
        return bible.value.bookNumber >= 470 ? 'G' : 'H'
      }
    })


    const hideOrShowFullWindow = (key, state) => {

      if (!transitions[key].value === false || state === false) {
        if (/Settings/.test(key)) {
          bibleTextKey.value++
        }
      }
      transitions[key].value = state ?? !transitions[key].value
    }

    return {
      bible,
      strong,
      commentaries,
      info,
      booksList,
      hideOrShowFullWindow,
      textDirections,
      bookNames,
      refString,
      topBarHeight,
      chapterString,
      strongNumbersPrefix,
      bibleTextKey,
      chosenVerse,
      transitions,
      bookSelector: transitions.bookSelector,
      bookSearcher: transitions.bookSearcher,
      strongSearcher: transitions.strongSearcher,
      crossreferencesSearcher: transitions.crossreferencesSearcher,
      translationsComparator: transitions.translationsComparator,
      subheadingsSettings: transitions.subheadingsSettings,
      commentariesSettings: transitions.commentariesSettings
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  components: {
    BibleTopBar,
    BookSelector,
    textSearcher,
    StrongSearcher,
    Splitter,
    CrossreferencesSearcher,
    SubheadingsSettings,
    CommentariesSettings,
    TranslationsComparator
  }
})
</script>
