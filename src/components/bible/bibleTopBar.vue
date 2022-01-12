<template>
  <UIButtonset>
    <ModuleSelector
      :file-name="bookFileName"
      :path="['modules', 'books']"
      module="bible"
    />

    <q-separator vertical/>

    <q-btn
      class='grow-1'
      :label='`${bookShortName ?? "..."} ${chapterNumber}`'
      no-caps
      no-wrap
      stretch
      unelevated
      @click.stop="openWindow('bookSelector')"
    />

    <q-separator vertical/>

    <q-btn
      stretch
      unelevated
      icon='search'
      @click="openWindow('bookSearcher')"
    />

    <q-separator vertical/>

    <q-btn
      no-caps
      icon='navigate_before'
      :disable='arrows.before.disabled'
      stretch
      unelevated
      @click='onNavigateClick("before")'
    />

    <q-separator vertical/>

    <q-btn
      no-caps
      icon='navigate_next'
      :disable='arrows.next.disabled'
      stretch
      unelevated
      @click='onNavigateClick("next")'
    />
    <q-separator vertical/>

    <quick-settings :bible-view="bibleView"/>

    <template v-if="activeWorkPlacesCount > 1">
      <q-separator vertical/>
      <q-btn
        icon="close"
        stretch
        unelevated
        @click.stop="closeWindow"
      />
    </template>

  </UIButtonset>
  <q-separator/>
</template>


<script>
import QuickSettings from 'components/bible/topBar/quickSettings.vue'
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel";
import UIButtonset from "components/UI/UIButtonset";
import useBibleTopBar from "src/hooks/useBibleTopBar";

export default {
  setup(props) {
    const {
      arrows,
      onNavigateClick,
      closeWindow,
      openWindow,
      activeWorkPlacesCount
    } = useBibleTopBar(props)

    return {
      arrows,
      horizontalScrollOnWheel,
      onNavigateClick,
      closeWindow,
      openWindow,
      activeWorkPlacesCount
    }
  },
  components: {UIButtonset, QuickSettings, ModuleSelector},
  props: {
    bibleView: Object,
    refString: String,
    bookNumber: Number,
    chapterNumber: Number,
    bookFileName: String,
    bookShortName: String
  }
}
</script>
