<template>
  <!--  <Transitions-->
  <!--    :text-directions="textDirections"-->
  <!--    :transitions="transitions"-->
  <!--    :book-full-name="bookFullName"-->
  <!--    :book-short-name="bookShortName"-->
  <!--    :strong-numbers-prefix="bibleModuleInfo.strong_numbers_prefix"-->
  <!--  />-->

  <div class="popup-windows">
    <transition name="fade">
      <component
        v-if="isPopupShown"
        :is="component"
      />
    </transition>
  </div>

  <Splitpanes
    horizontal
    class="full-height"
  >
    <Pane
      min-size="10"
      class="overflow-hidden flex d-column"
    >
      <Bible/>
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
          <Commentaries/>
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

<script lang="ts">
import {defineComponent} from "vue";
import Strong from 'components/Main/strong/strong.vue'
import Bible from 'components/Main/bible/Bible.vue'
import Commentaries from "components/Main/commentaries/Commentaries.vue";
import {Splitpanes, Pane} from 'splitpanes'
import useStore from "src/hooks/useStore";
import {computed, provide, ref} from "vue";
import useBibleModuleInfo from "src/hooks/useBibleModuleInfo";
import {useBibleDatabaseConnection} from "src/hooks/DBconnectionController";
import {initPopupWindows} from "src/hooks/usePopupWindows";
import {bible_, id_, popup_} from 'src/symbols'

export default defineComponent({
  setup({id}) {
    const store = useStore()
    const bible = store.state.getReactive(`workPlace.${id}.bible`)
    const bibleFileName = computed(() => bible.value.fileName)
    useBibleDatabaseConnection(bibleFileName)

    const {info: bibleModuleInfo} = useBibleModuleInfo(bibleFileName)
    const {component, isPopupShown, popup} = initPopupWindows()

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

    const bibleTextKey = ref(0)
    const bookFullName = ref(null)
    const bookShortName = ref(null)

    provide(id_, id)
    provide("bibleTextKey", bibleTextKey)
    provide('bookShortName', bookShortName)
    provide('bookFullName', bookFullName)
    provide(popup_, popup)
    provide(bible_, bible)
    provide('bibleModuleInfo', bibleModuleInfo)
    provide('activeWorkPlaceWindows', activeWorkPlaceWindows)
    provide('allModulesClosed', allModulesClosed)
    provide('viewParamsRequiringRerender', viewParamsRequiringRerender)
    provide('textDirections', textDirections)
    provide('refString', refString)
    provide('strongNumbersPrefix', strongNumbersPrefix)

    return {
      component,
      isPopupShown,

      activeWorkPlaceWindows,
      allModulesClosed,
      bible,
      bibleModuleInfo,
      bookShortName,
      bookFullName,
      textDirections,
      refString,
      viewParamsRequiringRerender,
      strongNumbersPrefix,
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  components: {
    Commentaries,
    Bible,
    Strong,
    Splitpanes,
    Pane
  }
})
</script>
