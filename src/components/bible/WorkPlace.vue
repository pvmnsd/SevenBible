<template>
  <Transitions
    :text-directions="textDirections"
    :transitions="transitions"
    :book-full-name="bookFullName"
    :book-short-name="bookShortName"
    :strong-numbers-prefix="bibleModuleInfo.strong_numbers_prefix"
  />
  <Splitpanes
    horizontal
    class="full-height"
  >
    <Pane
      min-size="10"
      class="overflow-hidden flex d-column"
    >
      <Bible
        :bible="bible"
        :info="bibleModuleInfo"
        :ref-string="refString"
        :view-params-requiring-rerender="viewParamsRequiringRerender"
        :strong-numbers-prefix="strongNumbersPrefix"
      />
    </Pane>
    <Pane
      v-if="!allModulesClosed"
      min-size="10"
      class="overflow-hidden"
    >
      <Splitpanes>

        <Pane
          v-if="activeWorkPlaceWindows.showCommentaries"
          min-size="10"
        >
          <Commentaries :ref-string="refString"/>
        </Pane>
        <Pane
          v-if='activeWorkPlaceWindows.showStrong'
          min-size="10"
        >
          <Strong/>
        </Pane>

      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>

<script>
import Strong from 'components/bible/splitter/strong.vue'
import Bible from 'components/bible/splitter/Bible.vue'
import Commentaries from "components/bible/splitter/Commentaries";
import {Splitpanes, Pane} from 'splitpanes'
import Transitions from "components/bible/Transitions";
import useStore from "src/hooks/useStore";
import {computed, watch} from "vue";
import useTransitions from "src/hooks/useTransitions";
import initWorkPlaceGlobalState from "src/hooks/initWorkPlaceGlobalState";
import useBibleModuleInfo from "src/hooks/useBibleModuleInfo";
import {useBibleDatabaseConnection} from "src/hooks/DBconnectionController";

export default {
  setup({id}) {
    const {bookFullName, bookShortName} = initWorkPlaceGlobalState(id)

    const store = useStore();
    const {transitions} = useTransitions()


    const bible = store.state.getReactive(`workPlace.${id}.bible`)
    const bibleFileName = computed(() => bible.value.fileName)
    useBibleDatabaseConnection(bibleFileName)

    const {info: bibleModuleInfo} = useBibleModuleInfo(bibleFileName)

    const activeWorkPlaceWindows = computed(() => {
      return store.getters.getActiveWorkPlaceWindows(id)
    })
    const allModulesClosed = computed(() => {
      return !activeWorkPlaceWindows.value.showStrong &&
        !activeWorkPlaceWindows.value.showCommentaries
    })

    const viewParamsRequiringRerender = computed(() => {
      const view = bible.value.view
      return view.showSubheadings + view.showCommentaries + view.showDreamy
    })
    const textDirections = computed(() => {
      return bibleModuleInfo.value.right_to_left === "true"
        ? {
          nt: "rtl",
          ot: "rtl",
        }
        : bibleModuleInfo.value.right_to_left_nt === "true"
          ? {
            nt: "rtl",
            ot: "ltr",
          }
          : bibleModuleInfo.value.right_to_left_ot === "true"
            ? {
              nt: "ltr",
              ot: "rtl",
            }
            : {
              nt: "ltr",
              ot: "ltr",
            };
    })
    const refString = computed(() => {
      return (
        bible.value.fileName +
        bible.value.bookNumber +
        bible.value.chapterNumber
      );
    });
    const strongNumbersPrefix = computed(() => {
      if (bibleModuleInfo.value.strong_numbers_prefix) {
        return bibleModuleInfo.value.strong_numbers_prefix;
      } else {
        return bible.value.bookNumber >= 470
          ? "G"
          : "H";
      }
    });


    return {
      activeWorkPlaceWindows,
      allModulesClosed,
      transitions,
      bible,
      bibleModuleInfo,
      bookShortName,
      bookFullName,
      textDirections,
      refString,
      viewParamsRequiringRerender,
      strongNumbersPrefix
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  components: {
    Transitions,
    Commentaries,
    Bible,
    Strong,
    Splitpanes,
    Pane
  }
}
</script>
