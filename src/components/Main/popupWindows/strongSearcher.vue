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
    <UIModalWindowHeader @close="close">
      <template #title>Поиск по номеру стронга</template>
      <q-btn disable flat round :icon='Icons.Dots'/>
    </UIModalWindowHeader>

    <UIModalWindowBody>
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
                :icon='Icons.Search'
                @click='searchByStrong'
              />
              <q-btn
                name='aaa'
                type='submit'
                flat
                round
                :icon='Icons.Settings'
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

      <DynamicVirtualScroller
        :items="foundedTexts"
        class="overlay separated"
      >
        <template v-slot="{item}">
          <q-item
            clickable
            class='q-px-md'
            @click='goToText(item.book_number,item.chapter)'
          >
            <q-item-section>
              <q-item-label caption
              >{{ item.bookShortName }}
                {{ item.chapter }}:{{ item.verse }}
              </q-item-label
              >
              <q-item-label v-html='item.text'></q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </DynamicVirtualScroller>
    </UIModalWindowBody>

  </UIModalWindow>
</template>

<script setup>
import useStore from "src/hooks/useStore";
import {onMounted, ref} from "vue"
import normalizeSearchInput from "src/hooks/normalizeSearchInput"
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindowSettings from "components/UI/ModalWindow/UIModalWindowSettings";
import useSevenBible from "src/hooks/useSevenBible";
import StrongBody from "components/Main/strong/StrongBody";
import DynamicVirtualScroller from "components/wrappers/DynamicVirtualScroller";
import {notify} from "src/wrappers/notify";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody";
import {Icons} from "src/types/icons";

const emit = defineEmits(['close'])

const {id, bibleModuleInfo} = useSevenBible()
const store = useStore()
const {
  bible: {
    fileName: bibleFileName
  },
  strong: {
    strongNumbers: fixedStrongNumbers,
    fileName: strongFileName
  }
} = store.native.state.settings.workPlace[id]


const close = (ref) => emit('close', ref)

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
    notify.showInfo('Строка поиска не может сожержать одновременно два префикса (H и G) в текущем режиме поиска.')
    return
  }


  const settings = {
    strongNumbers: [...strongNumbers.value],
    separator: searchMode.value.value,
    fixedStrongNumbersPrefix: bibleModuleInfo.value.strong_numbers_prefix,
    filename: bibleFileName
  }

  const normalizedNumbers = strongNumbers.value.map(curr => curr.substring(1))
  const strongNumbersRegexString = normalizedNumbers.join('|')
  const data = await window.api.strong.getFindedVerseByStrong(settings)

  const regex = new RegExp(`<S>(${strongNumbersRegexString})</S>`, 'gi')
  data.forEach(current => {
    current.text = current.text.replace(regex, `<mark>${current.strongNumbersPrefix}$1</mark>`)
  })

  foundedTexts.value = data
  textsCount.value = data.length
  showLoader.value = false
}
const goToText = (bookNumber, chapterNumber) => close({bookNumber, chapterNumber})


onMounted(() => {
  searchInput.value = fixedStrongNumbers.join(' ')
  searchByStrong()
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
