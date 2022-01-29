<template>

  <UIButtonset v-if="!selectedVerses.length" key="standard">
    <ModuleSelector
      :file-name="bibleFileName"
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
      @click.stop="openRefSelector"
    />

    <q-separator vertical/>

    <q-btn
      stretch
      unelevated
      icon='search'
      @click="openTextSearcher"
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
        @click.stop="closeWorkPlace"
      />
    </template>
  </UIButtonset>

  <UIButtonset v-else key="selector">
    <q-btn
      class='grow-1'
      :label='convertVerses(selectedVerses)'
      no-caps
      no-wrap
      stretch
      unelevated
    />
    <q-separator vertical/>
    <q-btn
      icon="cancel"
      no-caps
      no-wrap
      stretch
      unelevated
      @click="$emit('clear-selected-verses')"
    />
  </UIButtonset>

  <q-separator/>
</template>


<script>
import QuickSettings from 'components/bible/topBar/quickSettings.vue'
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel";
import UIButtonset from "components/UI/UIButtonset";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";
import useNavigations from "src/hooks/useNavigations";
import {computed} from "vue";
import {usePopupWindows} from "boot/popupWindows";
import {convertVerses} from "src/helpers";

export default {
  setup() {
    const {id, activeWorkPlaces, bookFullName, bookShortName} = useSevenBible()
    const store = useStore()
    const {arrows, onNavigateClick} = useNavigations(store, id)

    const closeWorkPlace = () => store.mutations.closeWorkPlace(id)

    const activeWorkPlacesCount = computed(() => activeWorkPlaces.value.indexes.length)

    const {showTextSearcher, showRefSelector} = usePopupWindows()

    const openRefSelector = async () => {
      const ref = await showRefSelector()
      if (!ref) return
      store.state.setBibleRef(id, ref)
    }
    const openTextSearcher = async () => {
      const ref = await showTextSearcher()
      if (!ref) return
      store.state.setBibleRef(id, ref)
    }

    return {
      arrows,
      horizontalScrollOnWheel,
      onNavigateClick,
      closeWorkPlace,
      openTextSearcher,
      openRefSelector,
      convertVerses,
      activeWorkPlacesCount,
      bookShortName
    }
  },
  components: {UIButtonset, QuickSettings, ModuleSelector},
  props: {
    bibleView: Object,
    bookNumber: Number,
    chapterNumber: Number,
    bibleFileName: String,
    selectedVerses: {
      type: Array,
      default: () => []
    }
  },
  emits: ['clear-selected-verses']
}
</script>
