<template>
  <div class='strong-searcher transition fit absolute-top column bg-background'>
    <div class='row q-pa-md'>
      <q-btn flat round icon='arrow_back' @click="$emit('toggleWindow','strongSearcher', false)"/>
      <div class='flex direction-center items-center text-bold q-px-xs'>Поиск по номеру стронга</div>
      <q-space/>
      <q-btn flat round icon='payments'/>
      <q-btn flat round icon='more_vert'/>
    </div>

    <q-separator color='blue' style='height: 2px'/>

    <q-form class='q-px-md q-gutter-lg q-mt-md'>

      <q-input
        clearable
        placeholder='Введите номер'
        filled
        for='aaa'
        v-model='searchInput'
        class='q-mt-none col'
        hint='Введите номера стронга через пробел'
      >
        <template v-slot:after>
          <q-btn
            name='aaa'
            type='submit'
            flat
            round
            icon='search'
            @click='searchByStrong'/>
        </template>

      </q-input>
      <q-select
        hint="Выберите режим поиска"
        style="max-width: 300px"
        filled
        v-model="searchMode"
        :options="options"
      />
    </q-form>

    <div class='q-pa-sm text-right'>Найдено текстов: {{ textsCount }}</div>

    <!--    <q-scroll-area class='q-py-sm' style='height: 100px'>-->
    <!--      <div class='strong-body q-px-xl q-py-sm q-gutter-sm'>-->

    <!--        <div v-for='(number, key, id) in strongInfo' :key='id'>-->
    <!--          <div class='text-bold text-green' v-show='strongInfo.length > 1'>{{ key }}</div>-->
    <!--          <div v-html='number.definition'>ds</div>-->
    <!--          <q-separator color='separator' class='q-my-xs'/>-->
    <!--          <div class='cognate row'>-->
    <!--            Однокоренные:-->
    <!--            <div style='margin: 0 2px' v-for='(cognate, i) in number.cognate' :key='i'>-->
    <!--              <a :href="'S:' + cognate">{{ cognate }}</a>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--      </div>-->
    <!--    </q-scroll-area>-->
    <q-separator color="separator"/>

    <q-scroll-area
      class="col"
      id="scroll-area"
    >
      <q-virtual-scroll
        scroll-target="#scroll-area > .scroll"
        :items-fn='getItems'
        :items-size='textsCount'
        :virtual-scroll-item-size='50'
      >
        <template v-slot='{ item = [], index }'>
          <div :key='index'>
            <q-separator color='separator'/>
            <q-item
              clickable
              class='q-px-md'
              @click='goToText(item.book_number,item.chapter)'
            >
              <q-item-section>
                <q-item-label caption
                >{{ item.bookFullName }}
                  {{ item.chapter }}:{{ item.verse }}
                </q-item-label
                >
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
import {defineComponent, inject, onMounted, ref} from "vue"
import {useQuasar} from "quasar"
import bookNamesFromNumber from "src/hooks/bookNamesFromNumber"
import normalizeSearchInput from "src/hooks/normalizeSearchInput"

let foundedTexts = []


export default defineComponent({
  setup(props, {emit}) {
    const id = inject('id')

    const options = [
      {
        value: 'AND',
        label: 'Искать стихи содержащие все введенные номера стронга'
      },
      {
        value: 'OR',
        label: 'Искать любой из введенных номеров стронга'
      }
    ]
    const searchMode = ref(options[1])
    const textsCount = ref(0)
    const strongInfo = ref(null)
    const normalizedSearchInputs = ref('')
    const searchInput = ref('')
    const showLoader = ref(false)

    const getItems = (from, size) => {
      const items = []

      for (let i = 0; i < size; i++) {
        items.push(foundedTexts[from + i])
      }

      return Object.freeze(items)
    }
    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const strongSearch = async strongNumbers => {
      const settings = {
        strongNumbers: [...strongNumbers],
        strongFileName: props.strongFileName
      }
      strongInfo.value = await window.electron.invoke('get-word-info-strong', settings)
    }
    const {notify} = useQuasar()
    const searchByStrong = async () => {
      showLoader.value = true
      normalizedSearchInputs.value = normalizeSearchInput(searchInput.value).split(' ')

      if (searchInput.value.toUpperCase().includes('H') && searchInput.value.toUpperCase().includes('G') && searchMode.value.value === 'AND') {
        notify({
          classes: 'not-found',
          type: 'info',
          position: 'bottom-right',
          timeout: 1500,
          message: 'Строка поиска не может сожержать одновременно два префикса (H и G) в текущем режиме поиска.'
        })
        return
      }


      const settings = {
        strongNumbers: [...normalizedSearchInputs.value],
        separator: searchMode.value.value,
        fixedStrongNumbersPrefix: props.fixedStrongNumbersPrefix,
        bookFileName: props.bookFileName
      }
      const normalizedNumbers = normalizedSearchInputs.value.map(curr => curr.substring(1))
      const strongNumbersRegexString = normalizedNumbers.join('|')
      const data = await window.electron.invoke('find-verse-by-strong', settings)

      const regex = new RegExp(`<S>(${strongNumbersRegexString})</S>`, 'gi')
      data.forEach(current => {
        current.bookFullName = bookNamesFromNumber(current.book_number, props.booksList).bookFullName
        current.text = current.text.replace(regex, `<mark>${current.strongNumbersPrefix}$1</mark>`)
      })

      foundedTexts = data
      textsCount.value = data.length
      showLoader.value = false
    }
    const goToText = (bookNumber, chapterNumber) => {
      changeModuleState({
        id,
        key: 'bible',
        settings: {
          bookNumber,
          chapterNumber
        }
      })
      emit('toggleWindow', 'strongSearcher', false)
    }

    onMounted(() => {
      searchInput.value = props.strongNumbers.join(' ')
      searchByStrong()
    })

    return{
      searchInput,
      searchMode,
      searchByStrong,
      options,
      textsCount,
      getItems,
      goToText
    }
  },
  props: {
    booksList: {
      type: Object,
      required: true
    },
    strongNumbers: [],
    strongFileName: String,
    fixedStrongNumbersPrefix: String,
    bookFileName: String
  }
})
</script>

<style lang='scss'>
.strong-searcher {
  j {
    color: var(--text);
  }

  mark {
    display: inline;
    vertical-align: super;
    font-size: 0.8em;
    padding: 0 3px;
    text-decoration: none;
  }
}
</style>
