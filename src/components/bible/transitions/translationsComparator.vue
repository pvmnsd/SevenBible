<template>
  <div class='fit absolute transition bg-background column'>
    <div>
      <div class='row q-pa-md'>
        <q-btn
          flat
          round
          icon='arrow_back'
          @click="$emit('toggleWindow', 'translationsComparator', false)"
        />
        <div class='flex direction-center items-center text-bold q-px-xs'>
          {{ bookShortName }} {{ chapterNumber }}:{{ verseNumber }} в разных местах
        </div>
        <q-space/>
        <q-btn flat round icon='payments'/>
        <q-btn flat round icon='more_vert'/>
      </div>
      <q-separator color='blue' style='height: 2px'/>
    </div>

    <q-scroll-area class="col">
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
    </q-scroll-area>

  </div>
</template>

<script>
import {mapMutations, useStore} from 'vuex'
import {ref, computed, onMounted, inject} from "vue";

export default {
  setup(props, {emit}) {
    const id = inject('id')

    const testament = computed(() => props.bookNumber >= 470 ? 'nt' : 'ot')

    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const goToModule = moduleName => {
      changeModuleState({id, key: 'bible', settings: {fileName: moduleName}})
      emit('toggleWindow', 'translationsComparator', false)
    }

    const translationsTexts = ref([])
    const getComparedTranslations = async () => {
      const settings = {
        bookNumber: props.bookNumber,
        chapterNumber: props.chapterNumber,
        verseNumber: props.verseNumber
      }
      translationsTexts.value = await window.electron.invoke('get-compared-translations', settings)
    }
    onMounted(() => getComparedTranslations())

    return {testament, goToModule, translationsTexts}
  },
  props: {
    bookShortName: String,
    bookNumber: Number,
    chapterNumber: Number,
    verseNumber: Number
  }
}
</script>
