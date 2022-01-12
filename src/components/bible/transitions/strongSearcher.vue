<template>
  <UIModalWindow>
    <q-dialog ref="dialog">
      <q-card>
        <q-card-section class="scroll-container" style="max-height: 50vh">
          <q-select
            hint="Выберите режим поиска"
            style="max-width: 300px"
            filled
            v-model="searchMode"
            :options="options"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <UIModalWindowHeader>
      <q-btn flat round icon='arrow_back' @click="close"/>
      <div class='flex direction-center items-center text-bold q-px-xs'>Поиск по номеру стронга</div>
      <q-space/>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>

    <UIModalWindowSettings>
      <q-form>
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
              @click='searchByStrong'
            />
            <q-btn
              name='aaa'
              type='submit'
              flat
              round
              icon='settings'
              @click='$refs.dialog.show()'
            />
          </template>

        </q-input>
      </q-form>

      <div class='q-pa-sm text-right'>Найдено текстов: {{ textsCount }}</div>

      <StrongBody
        :strong-numbers="strongNumbers"
        :strong-file-name="strongFileName"
        class="overlay strong-searcher-strong-body shadow-4 rounded-borders container"
        style="max-height: 150px"
      />


    </UIModalWindowSettings>

    <div class="overlay">
      <template
        v-for="(item, i) in foundedTexts"
        :key='i'
      >
        <q-separator/>
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
      </template>
    </div>

  </UIModalWindow>
</template>

<script>
import useStore from "src/hooks/useStore";
import {defineComponent, onMounted, ref} from "vue"
import {useQuasar} from "quasar"
import normalizeSearchInput from "src/hooks/normalizeSearchInput"
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindowSettings from "components/UI/ModalWindow/UIModalWindowSettings";
import useSevenBible from "src/hooks/useSevenBible";
import StrongBody from "components/bible/splitter/StrongBody";

export default defineComponent({
  components: {
    UIModalWindowSettings,
    UIModalWindowHeader,
    UIModalWindow,
    StrongBody
  },
  setup(props) {
    const {id, transitions} = useSevenBible()
    const {notify} = useQuasar()
    const store = useStore()
    const {
      bible: {
        fileName: bookFileName
      },
      strong: {
        strongNumbers: fixedStrongNumbers,
        fileName: strongFileName
      }
    } = store.native.state.settings.workPlace[id]


    const close = () => transitions.strongSearcher = false

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
    const searchInput = ref('')
    const showLoader = ref(false)
    const strongNumbers = ref([])

    const foundedTexts = ref([])
    const searchByStrong = async () => {
      showLoader.value = true
      strongNumbers.value = normalizeSearchInput(searchInput.value).split(' ')

      if (searchInput.value.toUpperCase().includes('H') && searchInput.value.toUpperCase().includes('G') && searchMode.value.value === 'AND') {
        notify({
          classes: 'not-found',
          type: 'info',
          position: 'bottom-right',
          timeout: 3000,
          message: 'Строка поиска не может сожержать одновременно два префикса (H и G) в текущем режиме поиска.'
        })
        return
      }


      const settings = {
        strongNumbers: [...strongNumbers.value],
        separator: searchMode.value.value,
        fixedStrongNumbersPrefix: props.strongNumbersPrefix,
        bookFileName: bookFileName
      }
      const normalizedNumbers = strongNumbers.value.map(curr => curr.substring(1))
      const strongNumbersRegexString = normalizedNumbers.join('|')
      const data = await window.electron.invoke('find-verse-by-strong', settings)

      const regex = new RegExp(`<S>(${strongNumbersRegexString})</S>`, 'gi')
      data.forEach(current => {
        current.text = current.text.replace(regex, `<mark>${current.strongNumbersPrefix}$1</mark>`)
      })

      foundedTexts.value = data
      textsCount.value = data.length
      showLoader.value = false
    }
    const goToText = (bookNumber, chapterNumber) => {
      store.state.set(`workPlace.${id}.bible`, {bookNumber, chapterNumber})
      close()
    }


    onMounted(() => {
      searchInput.value = fixedStrongNumbers.join(' ')
      searchByStrong()
    })


    return {
      searchInput,
      searchMode,
      options,
      textsCount,
      goToText,
      searchByStrong,
      close,
      strongNumbers,
      strongFileName,
      foundedTexts
    }
  },
  props:{
    strongNumbersPrefix: String
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
