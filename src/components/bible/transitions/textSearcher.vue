<template>
  <div class='fit absolute transition bg-background column'>
    <div class='search-head'>
      <div class='ref-choose-top-bar row q-pa-md'>
        <q-btn
          flat
          round
          icon='arrow_back'
          @click="$emit('toggleWindow', 'bookSearcher', false)"
        />
        <div class='flex direction-center items-center text-bold q-px-xs'>
          Поиск по библии - {{ bookFileName }}
        </div>
        <q-space/>
        <q-btn flat round icon='payments'/>
        <q-btn flat round icon='more_vert'/>
      </div>
      <q-separator color='blue' style='height: 2px'/>

      <q-form>
        <q-input
          placeholder='Поиск'
          filled
          v-model='searchInput'
          counter
          class='q-px-md q-pt-md'
          ref="input"
          for="btn"
        >
          <template v-slot:after>
            <q-btn ref="btn" name="btn" type="submit" round flat icon='search' @click='searchText()'/>
          </template>
        </q-input>
      </q-form>
    </div>

    <q-linear-progress v-if='showLoader' query/>

    <q-scroll-area
      id="scroll-area"
      class="q-mt-md col found-text"
    >
      <q-virtual-scroll
        :items-fn="getItems"
        :items-size='textsCount'
        :virtual-scroll-item-size='75'
        scroll-target="#scroll-area > .scroll"
      >
        <template v-slot='{ item, index }'>
          <div :key='index'>
            <q-separator color='separator'/>
            <q-item
              clickable
              class='q-px-md'
              @click='goToText(item.book_number, item.chapter)'
            >
              <q-item-section>
                <q-item-label caption>
                  {{ getBookFullName(item.book_number) }}
                  {{ item.chapter }}:{{ item.verse }}
                </q-item-label>
                <q-item-label v-html='item.text'></q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {defineComponent, inject, ref, onMounted} from "vue"
import {highlightSearch} from "src/hooks/highlight"
import normalizeSearchInput from "src/hooks/normalizeSearchInput"
import bookNamesFromNumber from 'src/hooks/bookNamesFromNumber'

let foundedTexts = []

export default defineComponent({
  setup(props, {emit}) {
    const id = inject('id')

    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const showLoader = ref(false)
    const searchInput = ref('')
    let normalizedSearchInput = ''
    let keywordsToHighlight = []
    const textsCount = ref(0)


    const goToText = (bookNumber, chapterNumber) => {
      changeModuleState({
        id,
        key: 'bible',
        settings: {bookNumber, chapterNumber}
      })
      emit('toggleWindow', 'bookSearcher', false)
    }

    const searchText = async () => {
      showLoader.value = true
      textsCount.value = 0
      normalizedSearchInput = normalizeSearchInput(searchInput.value)
      keywordsToHighlight = normalizedSearchInput.split(' ')

      const settings = {
        searchString: normalizedSearchInput,
        bookFileName: props.bookFileName
      }
      foundedTexts = await window.electron.invoke('find-texts-in-bible', settings)
      textsCount.value = foundedTexts.length
      showLoader.value = false
    }

    const getItems = (from, size) => {
      const items = []

      for (let i = 0; i < size; i++) {
        items.push(foundedTexts[from + i])
      }
      items.forEach(item => item.text = highlightSearch(item.text, keywordsToHighlight))
      return Object.freeze(items)
    }
    const getBookFullName = bookNumber => bookNamesFromNumber(bookNumber, props.booksList).bookFullName

    const input = ref(null)
    onMounted(() => setTimeout(() => input.value.focus(),300))
    return {
      searchInput,
      showLoader,
      textsCount,
      input,
      getItems,
      searchText,
      getBookFullName,
      goToText
    }

  },
  props: {bookFileName: String, booksList: Object}
})
</script>
