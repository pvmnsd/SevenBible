<template>
  <Splitpanes
    class="column col"
    horizontal
  >
    <Pane
      class="column col"
      min-size="10"
    >
      <bible-text
        :ref-string="refString"
        :chapter-number="bible.chapterNumber"
        :book-number="bible.bookNumber"
        :book-full-name="bookNames.bookFullName"
        :info="info"
        :view="bible.view"
        :book-file-name="bible.fileName"
        :strong-numbers-prefix="strongNumbersPrefix"
        :chapter-string="chapterString"
        :style="{direction: textDirection}"
        :key="bibleTextKey"
      />
    </Pane>
    <Pane
      v-if="!allModulesClosed"
      class="column col-auto"
      min-size="10"
    >
      <Splitpanes class="column col">

        <Pane
          v-if="commentaries.show"
          class="column row col-auto"
          min-size="10"
        >
          <Commentaries
            :book-file-name="bible.fileName"
            :chapter-number="bible.chapterNumber"
            :commentaries-file-name="commentaries.fileName"
            :book-number="bible.bookNumber"
            :book-short-name="bookNames.bookShortName"
          />
        </Pane>
        <Pane
          v-if='strong.show'
          class="column row col"
          min-size="10"
        >
          <Strong
            :strong-file-name="strong.fileName"
            :strong-numbers="strong.strongNumbers"
          />
        </Pane>

      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>

<script>
import Strong from 'components/bible/splitter/strong.vue'
import BibleText from 'components/bible/splitter/bibleText.vue'
import Commentaries from "components/bible/splitter/Commentaries";
import {Splitpanes, Pane} from 'splitpanes'
import {computed} from "vue";

export default {
  setup(props){
    const allModulesClosed = computed(() => {
      return !props.strong.show && !props.commentaries.show
    })
    return { allModulesClosed }
  },
  props: {
    bible: {
      type: Object,
      required: true
    },
    strong: Object,
    commentaries: Object,
    topBarHeight: Number,
    info: {
      type: Object,
      required: true
    },
    bookNames: {
      type: Object,
      default: () => {
      }
    },
    refString: String,
    strongNumbersPrefix: String,
    bibleTextKey: Number,
    chapterString: {
      type: String,
      default: '...'
    },
    textDirection: String
  },
  components: {Commentaries, BibleText, Strong, Splitpanes, Pane}
}
</script>
<style lang="scss">
.aaa {
  max-height: 500px !important;
}
</style>
