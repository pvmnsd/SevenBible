<template>

  <UIButtonset v-if="!selectedVerses.length" key="standard">
    <ModuleSelector
      :file-name="bibleFileName"
      :path="['modules', 'books']"
      module="bible"
    />

    <q-separator vertical/>

    <UIButton
      class='grow-1'
      :label='`${bookShortName ?? "..."} ${chapterNumber}`'
      @click.stop="openRefSelector"
    />

    <q-separator vertical/>

    <UIButton
      icon='search'
      @click="openTextSearcher"
    />

    <q-separator vertical/>

    <UIButton
      icon='navigate_before'
      :disable='arrows.before.disabled'
      @click='onNavigateClick("before")'
    />

    <q-separator vertical/>

    <UIButton
      icon='navigate_next'
      :disable='arrows.next.disabled'
      @click='onNavigateClick("next")'
    />
    <q-separator vertical/>

    <quick-settings/>

    <template v-if="activeWorkPlacesCount > 1">
      <q-separator vertical/>
      <UIButton
        icon="close"
        @click.stop="closeWorkPlace"
      />
    </template>
  </UIButtonset>

  <UIButtonset v-else key="selector">

    <UIButton
      :tooltip="$t('cancelSelection')"
      icon="cancel"
      @click="$emit('clear-selected-verses')"
    />

    <q-separator vertical/>

    <UIButton
      :tooltip="$t('copyRef')"
      class='grow-1'
      :label="`${bookShortName} ${chapterNumber}:${convertVerses(selectedVerses)}`"
    />


    <q-separator vertical/>

    <UIButton
      :tooltip="$t('copy')"
      icon="content_copy"
    />

    <q-separator vertical/>

    <UIButton
      @click="openCrossreferencesSearcher"
      :tooltip="$t('searchCrossreferences')"
      icon="shuffle"
      :disable="selectedVerses.length > 1"
    />

    <q-separator vertical/>

    <UIButton
      @click="compareSelectedVerses"
      :tooltip="$t('compareTranslations')"
      icon="book"
    />

    <q-separator vertical/>

    <UIButton
      @click="openCommentariesComparator"
      :tooltip="$t('searchCommentaries')"
      icon="question_answer"
      :disable="selectedVerses.length > 1"
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
import UIButton from "components/UI/UIButton";

export default {
  setup(props) {
    const {id, activeWorkPlaces, bookFullName, bookShortName} = useSevenBible()
    const store = useStore()
    const {arrows, onNavigateClick} = useNavigations(store, id)

    const closeWorkPlace = () => store.mutations.closeWorkPlace(id)

    const activeWorkPlacesCount = computed(() => activeWorkPlaces.value.indexes.length)

    const popup = usePopupWindows()

    const openPopupAndSetRef = async (callback, props = {}) => {
      const ref = await callback(props)
      if (!ref) return
      store.state.setBibleRef(id, ref)
    }
    const openRefSelector = () => openPopupAndSetRef(popup.showRefSelector)
    const openTextSearcher = () => openPopupAndSetRef(popup.showTextSearcher)
    const compareSelectedVerses = () => openPopupAndSetRef(
      popup.showTranslationsComparator, {selectedVerses: props.selectedVerses}
    )
    const openCrossreferencesSearcher = () => openPopupAndSetRef(
      popup.showCrossreferencesSearcher, {selectedVerses: props.selectedVerses}
    )
    const openCommentariesComparator = () =>
      popup.showCommentariesComparator({verseNumber: props.selectedVerses[0]})

    return {
      arrows,
      horizontalScrollOnWheel,
      onNavigateClick,
      closeWorkPlace,
      openTextSearcher,
      openRefSelector,
      convertVerses,
      activeWorkPlacesCount,
      bookShortName,
      compareSelectedVerses,
      openCrossreferencesSearcher,
      openCommentariesComparator
    }
  },
  components: {UIButton, UIButtonset, QuickSettings, ModuleSelector},
  props: {
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
