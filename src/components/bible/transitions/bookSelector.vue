<template>
  <UIModalWindow>
    <UIModalWindowHeader>
      <q-btn
        flat
        round
        icon="arrow_back"
        @click.stop="step === 1 ? transitions.bookSelector = false : step--"
      />
      <div
        class="flex items-center text-bold"
        v-text="step === 1 ? `Выбор книги - ${fileName}`
        : `${selectedBookName} - ${fileName}`"
      />
      <q-space/>
      <q-btn
        disable
        flat
        round
        icon="more_vert"
      />
    </UIModalWindowHeader>

    <div class="overflow-hidden-x overlay-y">

      <div v-if="step === 1">
        <div
          class="row bordered-buttons top"
          :class="textDirections.ot"
        >
          <q-btn
            v-for="book in oldTestamentBooks"
            :key="book.book_number"
            class="col-md-1 col-xs-2 col-sm-2"
            flat
            stretch
            no-caps
            :class="{active: book.book_number === bookNumber}, book.bookCategory"
            :label="book.short_name"
            @click="firstStep(book.book_number, book.long_name)"
          />
        </div>
        <div
          v-if="newTestamentBooks.length"
          class="row bordered-buttons bottom"
          :class="textDirections.nt"
        >
          <q-btn
            v-for="book in newTestamentBooks"
            :key="book.book_number"
            unelevated
            no-caps
            stretch
            class="col-md-1 col-xs-2 col-sm-2"
            :class="{ active: book.book_number === bookNumber }, book.bookCategory"
            :label="book.short_name"
            @click="firstStep(book.book_number, book.long_name)"
          />
        </div>
      </div>

      <div v-if="step === 2" class="row bordered-buttons top">
        <q-btn
          v-for="chapter in countOfChapters"
          :key="chapter"
          class="col-md-1 col-xs-2 col-sm-2"
          unelevated
          stretch
          no-caps
          :class="{active: chapter === chapterNumber && selectedBookName === bookFullName}"
          :label="chapter"
          @click.once="secondStep(chapter)"
        />
      </div>

    </div>

  </UIModalWindow>

</template>

<script>
import useStore from "src/hooks/useStore";
import {ref} from "vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow"
import useSevenBible from "src/hooks/useSevenBible";
import useBibleModuleTables from "src/hooks/useBibleModuleTables";

export default {
  components: {
    UIModalWindowHeader,
    UIModalWindow
  },

  async setup(props) {
    const {id, transitions} = useSevenBible()
    const store = useStore()
    const {fileName, chapterNumber, bookNumber} = store.native.state.settings.workPlace[id].bible

    const step = ref(1)
    const countOfChapters = ref(0)
    const selectedBookNumber = ref(0)
    const selectedBookName = ref('')

    const {booksList, initBooksCategories} = await useBibleModuleTables(fileName)
    initBooksCategories()

    const newTestamentBooks = booksList.filter(book => book.book_number >= 470)
    const oldTestamentBooks = booksList.filter(book => book.book_number <= 460)


    const secondStep = newChapterNumber => {
      const newRef = {
        bookNumber: selectedBookNumber.value,
        chapterNumber: newChapterNumber
      }
      store.state.set(`workPlace.${id}.bible`, newRef)
      transitions.bookSelector = false
    }

    const firstStep = async (bookNumber, bookFullName) => {
      const settings = {
        bookNumber,
        bookFileName: fileName
      }
      countOfChapters.value = await window.electron.invoke('get-count-of-chapters', settings)
      selectedBookNumber.value = bookNumber
      selectedBookName.value = bookFullName
      step.value++
    }


    return {
      transitions,
      newTestamentBooks,
      oldTestamentBooks,
      firstStep,
      secondStep,
      selectedBookName,
      countOfChapters,
      step,
      fileName,
      chapterNumber,
      bookNumber
    }
  },

  props: {
    textDirections: Object,
    bookFullName: String
  }
}
</script>

<style lang="scss">

.active {
  background: var(--q-background-active);
}

.bordered-buttons {
  &.top {
    margin: 0 -1px 0 0;

    button {
      border-bottom: 1px solid var(--q-separator);
      border-right: 1px solid var(--q-separator);
    }

    &.rtl {
      margin: 0 0 0 -1px;
      direction: rtl;

      button {
        border-left: 1px solid var(--q-separator);
        border-right: none !important;
      }
    }
  }

  &.bottom {
    border-top: 1px solid var(--q-separator);
    margin: -1px -1px 0 0;

    button {
      border-bottom: 1px solid var(--q-separator);
      border-right: 1px solid var(--q-separator);
    }

    &.rtl {
      margin: -1px 0 0 -1px;
      direction: rtl;

      button {
        border-left: 1px solid var(--q-separator);
        border-right: none !important;
      }
    }
  }
}
</style>
