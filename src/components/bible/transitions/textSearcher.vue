<template>
  <UIModalWindow>

    <UIModalWindowHeader @close="close">
      <template #title>Поиск по библии - {{ bibleFileName }}</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>

    <UIModalWindowSettings>
      <q-form>
        <q-input
          placeholder='Поиск'
          filled
          v-model='searchInput'
          counter
          ref="input"
          for="btn"
        >
          <template v-slot:after>
            <q-btn
              ref="btn"
              name="btn"
              type="submit"
              round flat
              icon='search'
              @click='searchText()'
            />
          </template>
        </q-input>
      </q-form>
    </UIModalWindowSettings>

    <q-linear-progress v-if='showLoader' query/>

    <DynamicVirtualScroller
      :items="foundedTexts"
      class="overlay"
    >
      <template v-slot="{item}">
        <q-separator/>
        <q-item
          clickable
          class='q-px-md'
          @click='goToText(item.book_number, item.chapter)'
        >
          <q-item-section>
            <q-item-label caption>
              {{ item.long_name }}
              {{ item.chapter }}:{{ item.verse }}
            </q-item-label>
            <q-item-label v-html='item.text'></q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </DynamicVirtualScroller>


  </UIModalWindow>
</template>

<script>
import useStore from "src/hooks/useStore";
import {ref, onMounted} from "vue"
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindowSettings from "components/UI/ModalWindow/UIModalWindowSettings";
import useSevenBible from "src/hooks/useSevenBible";
import useTextSearcher from "src/hooks/useTextSearcher";
import DynamicVirtualScroller from "components/wrappers/DynamicVirtualScroller";

export default {
  components: {
    DynamicVirtualScroller,
    UIModalWindowSettings,
    UIModalWindowHeader,
    UIModalWindow
  },
  setup() {

    const {transitions, id} = useSevenBible()
    const close = () => transitions.bookSearcher = false
    const store = useStore()
    const bibleFileName = ref(store.native.state.settings.workPlace[id].bible.fileName)
    const {
      showLoader,
      searchInput,
      textsCount,
      foundedTexts,
      searchText
    } = useTextSearcher(bibleFileName)

    const goToText = (bookNumber, chapterNumber) => {
      store.state.set(`workPlace.${id}.bible`, {bookNumber, chapterNumber})
      close()
    }


    const input = ref(null)
    onMounted(() =>
      setTimeout(() => input.value.focus(), 300)
    )

    return {
      bibleFileName,
      searchInput,
      showLoader,
      textsCount,
      input,
      foundedTexts,
      searchText,
      goToText,
      close
    }

  },
}
</script>
