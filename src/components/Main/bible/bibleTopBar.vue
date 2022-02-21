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
      :icon='Icons.Search'
      @click="openTextSearcher"
    />

    <q-separator vertical/>

    <UIButton
      :title="$t('openStrong')"
      :icon="Icons.Strong"
    />

    <q-separator vertical/>

    <UIButton
      :title="$t('openCommentaries')"
      :icon="Icons.Commentaries"
    />

    <q-separator vertical/>

    <UIButton
      :title="$t('openBookmarksManager')"
      :icon="Icons.Bookmark"
      @click="popup.showBookmarksManager"
    />

    <q-separator vertical/>

    <UIButton
      disable
      :icon="Icons.Dictionary"
    />

    <q-separator vertical/>

    <UIButton
      :icon='Icons.PrevChapter'
      :disable='arrows.before.disabled'
      @click='onNavigateClick("before")'
    />

    <q-separator vertical/>

    <UIButton
      :icon='Icons.NextChapter'
      :disable='arrows.next.disabled'
      @click='onNavigateClick("next")'
    />
    <q-separator vertical/>

    <quick-settings/>

    <template v-if="activeWorkPlacesCount > 1">
      <q-separator vertical/>
      <UIButton
        :icon="Icons.Close"
        @click.stop="closeWorkPlace"
      />
    </template>
  </UIButtonset>

  <UIButtonset v-else key="selector">

    <UIButton
      :tooltip="$t('cancelSelection')"
      :icon="Icons.Cancel"
      @click="$emit('clearSelectedVerses')"
    />

    <q-separator vertical/>

    <UIButton
      :tooltip="$t('copyRef')"
      class='grow-1'
      :label="selectionRef"
      @click="copySelectionRef"
    />


    <q-separator vertical/>

    <UIButton
      :tooltip="$t('copy')"
      :icon="Icons.Copy"
      @click="$emit('copyVerses')"
    />

    <q-separator vertical/>

    <UIButton
      :tooltip="$t('makeBookmark')"
      :icon="Icons.MakeBookmark"
      @click="openBookmarkCreator"
    />

    <q-separator vertical/>

    <UIButton
      @click="openCrossreferencesSearcher"
      :tooltip="$t('searchCrossreferences')"
      :icon="Icons.CompareCrossreferences"
      :disable="selectedVerses.length > 1"
    />

    <q-separator vertical/>

    <UIButton
      @click="compareSelectedVerses"
      :tooltip="$t('compareTranslations')"
      :icon="Icons.Book"
    />

    <q-separator vertical/>

    <UIButton
      @click="openCommentariesComparator"
      :tooltip="$t('searchCommentaries')"
      :icon="Icons.CompareCommentaries"
      :disable="selectedVerses.length > 1"
    />


  </UIButtonset>

  <q-separator/>
</template>


<script setup lang="ts">
import QuickSettings from 'components/Main/bible/quickSettings.vue'
import ModuleSelector from 'components/Main/popupWindows/ModuleSelector.vue'
import UIButtonset from "components/UI/UIButtonset.vue";
import useSevenBible from "src/hooks/useSevenBible";
import useStore from "src/hooks/useStore";
import useNavigations from "src/hooks/useNavigations";
import {computed} from "vue";
import {convertVerses} from 'src/helpers/verseSelector'
import UIButton from "components/UI/UIButton.vue";
import {notify} from "src/wrappers/notify";
import {useI18n} from "vue-i18n";
import {cropString} from "src/helpers";
import {Icons} from "src/types/icons";

interface Props {
  bookNumber: number,
  chapterNumber: number,
  bibleFileName: string,
  selectedVerses: number[]
}
const props = withDefaults(defineProps<Props>(), {selectedVerses: () => []})

const emit = defineEmits(['clearSelectedVerses', 'copyVerses'])

const {id, activeWorkPlaces, popup, bookShortName} = useSevenBible()
const store = useStore()
const {arrows, onNavigateClick} = useNavigations(store, id)

const closeWorkPlace = () => store.mutations.closeWorkPlace(id)

const activeWorkPlacesCount = computed(() => activeWorkPlaces.value.indexes.length)

const {t} = useI18n()

const openPopupAndSetRef = async (callback: CallableFunction, props = {}) => {
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

const selectionRef = computed(() => `${bookShortName.value} ${props.chapterNumber}:${convertVerses(props.selectedVerses)}`)

const copySelectionRef = () => {
  const text = selectionRef.value
  navigator.clipboard.writeText(text)
  notify.showInfo(`${t('textCopied')}: "${cropString(text, 30)}"`)
}

const openBookmarkCreator = () => {
  const verses = props.selectedVerses
  popup.showBookmarkCreator({
    _bookmark: {
      startVerseNumber: verses[0],
      endVerseNumber: verses[verses.length - 1]
    }
  })
}

</script>
