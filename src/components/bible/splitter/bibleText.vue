<template>
  <q-scroll-area class="col" ref="textScrollArea">
    <div v-if='isError' class='q-pa-md text-center'>{{ errorMessage }}</div>
    <!--suppress HtmlUnknownAttribute -->
    <div
      v-else
      style="overflow-x: hidden"
      class='q-px-xl q-py-md bible-text'
      :style="{fontSize: view.fontSize + 'px'}"
      :showBookName="view.showBookName.toString()"
      :showChapterNumber="view.showChapterNumber.toString()"
      :showSubheadings="view.showSubheadings"
      :showCommentaries="view.showCommentaries"
      :showVerseNumber="view.showVerseNumber.toString()"
      :showJesusWords="view.showJesusWords.toString()"
      :showStrongNumbers="view.showStrongNumbers.toString()"
      :showParagraphs="view.showParagraphs.toString()"
      :showContinuousText="view.showContinuousText.toString()"
      :showDreamy='view.showDreamy.toString()'
    >

      <headings
        :chapter-string="chapterString"
        :introduction-string="info.introduction_string"
        :chapter-number="chapterNumber"
        :description="info.description"
        :detailed-info="info.detailed_info"
        :book-full-name="bookFullName"
        :book-number="bookNumber"
        :ref-string="refString"
        :book-file-name="bookFileName"
      />

      <div
        class='verses'
        ref="verses"
        @click.stop="onVersesBlockClick"
        @copy="copyText"
      >
        <ContextMenu
          :verses="$refs.verses"
          :book-short-name="bookShortName"
        />
        <q-popup-proxy
          ref="popupProxy"
          no-parent-event
          :target="popupProxyTarget"
        >
          <div class="q-pa-md" v-html="popupProxyText"/>
        </q-popup-proxy>
        <div
          v-for='(verse, i) in chapterText'
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
            <VerseNumber
              class="number"
              :number='i + 1'
              @click.stop="$parent.$parent.$emit('setVerse', i + 1)"
            />
            <span class="text" v-html='verse.text'/>
          </span>

          <span
            class="commentary q-pl-xs"
            v-for="(commentary, idx) in verse.commentaries"
            :key="'B' + idx"
            @click="({target: element}) => {
              popupProxyTarget = element
              popupProxyText = commentary.text
              $refs.popupProxy.toggle()
            }"
          >
            {{ commentary.moduleName }}
          </span>

        </div>
      </div>
    </div>
  </q-scroll-area>
</template>

<script>
import VerseNumber from 'components/bible/splitter/VerseNumber.vue'
import Headings from 'components/bible/splitter/headings.vue'
import {computed, defineComponent, ref, onMounted, watch, inject} from 'vue'
import {useStore} from "vuex"
import {useQuasar} from "quasar"
import getChapter from 'src/hooks/getChapter'
import getFootnotes from 'src/hooks/getFootnotes'
import {strongSearch, getCommentByFootnote} from 'src/hooks/wordEvents'
import ContextMenu from "components/bible/splitter/bibleText/ContextMenu";

export default defineComponent({
  setup(props){
    const id = inject('id')

    const isError = ref(false)
    const errorMessage = ref('Erroooooor')
    const textScrollArea = ref(null)
    const chapterText = ref([])
    onMounted( async () => {
      await getChapter(props, chapterText, textScrollArea, isError, errorMessage)
      footnotes = await getFootnotes(props)
    })

    const viewParamsRequiringRerender = computed(() => props.view.showSubheadings + props.view.showCommentaries + props.view.showDreamy)
    watch([() => props.refString, viewParamsRequiringRerender], () => {
      getChapter(props, chapterText, textScrollArea, isError, errorMessage)
      footnotes = getFootnotes(props)
    })

    const {notify} = useQuasar()
    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    let footnotes = null
    const isStrong = computed(() => props.info.strong_numbers === 'false' ? false : ('strong_numbers') in props.info)
    const popupProxyTarget = ref(undefined)
    const popupProxyText = ref('')
    const popupProxy = ref(null)
    const onVersesBlockClick = ({target: element}) => {
      if (element.tagName === "S")
        changeModuleState({
          key: "strong", settings: {
            id,
            show: true,
            strongNumbers: [props.strongNumbersPrefix + element.innerText]
          }
        })

      if (element.tagName === "W")
        strongSearch(id, element, isStrong.value, props.strongNumbersPrefix, notify, changeModuleState)

      if(element.tagName === "F")
        getCommentByFootnote(element, popupProxyTarget, popupProxyText, popupProxy, footnotes)
    }

    const copyText = async () => {
      let text = await navigator.clipboard.readText()
      text = text.replace(/\n/g, ' ')
      navigator.clipboard.writeText(text)
    }

    return {
      textScrollArea,
      chapterText,
      popupProxyText,
      popupProxyTarget,
      isStrong,
      popupProxy,
      onVersesBlockClick,
      copyText,
      isError,
      errorMessage
    }
  },
  components: {ContextMenu, Headings, VerseNumber },
  props: {
    view: Object,
    info: Object,
    bookFullName: String,
    bookShortName: String,
    refString: String,
    bookNumber: Number,
    chapterNumber: Number,
    bookFileName: String,
    strongNumbersPrefix: String,
    chapterString: String
  },
})
</script>
