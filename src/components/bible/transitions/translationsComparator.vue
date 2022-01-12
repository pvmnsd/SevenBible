<template>
  <UIModalWindow>

    <UIModalWindowHeader>
      <q-btn
        flat
        round
        icon='arrow_back'
        @click="close"
      />
      <div class='flex direction-center items-center text-bold q-px-xs'>
        {{ bookShortName }} {{ chapterNumber }}:{{ chosenVerse }} в разных местах
      </div>
      <q-space/>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>

    <div class="overlay">
      <q-list separator>
        <q-item
          clickable
          v-ripple
          v-for="(translationText, idx) in translationsTexts"
          :key="idx"
          @click="goToModule(translationText.moduleName)"
          :dir="translationText.direction[testament]"
        >
          <q-item-section>
            <q-item-label
              class="q-gutter-x-md q-pb-sm"
            >
              <span class="text-weight-bold">{{ translationText.moduleName }}</span>
              <span class="text-weight-light">{{ translationText.moduleDescription }}</span>
            </q-item-label>

            <q-item-label>
              <div v-html="translationText.text"/>
            </q-item-label>

          </q-item-section>
        </q-item>
      </q-list>
    </div>

  </UIModalWindow>
</template>

<script>
import useStore from "src/hooks/useStore";
import {ref, computed, onMounted} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import useSevenBible from "src/hooks/useSevenBible";

export default {
  components: {UIModalWindowHeader, UIModalWindow},
  setup(props) {
    const {id, chosenVerse, transitions} = useSevenBible()
    const store = useStore()
    const {chapterNumber, bookNumber} = store.native.state.settings.workPlace[id].bible
    const testament = computed(() => props.bookNumber >= 470 ? 'nt' : 'ot')

    const close = () => transitions.translationsComparator = false

    const goToModule = moduleName => {
      store.state.set(`workPlace.${id}.bible.fileName`, moduleName)
      close()
    }

    const translationsTexts = ref([])
    const getComparedTranslations = async () => {
      const settings = {
        bookNumber: bookNumber,
        chapterNumber: chapterNumber,
        verseNumber: chosenVerse.value
      }
      translationsTexts.value = await window.electron.invoke('get-compared-translations', settings)
    }
    onMounted(() => getComparedTranslations())

    return {
      testament,
      translationsTexts,
      chosenVerse,
      chapterNumber,
      bookNumber,
      goToModule,
      close
    }
  },
  props: {
    bookShortName: String
  }
}
</script>
