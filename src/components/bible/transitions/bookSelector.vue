<template>
  <div class="selector absolute fit transition bg-background">
    <div class="fit column">

      <div class="ref-choose-top-bar row q-pa-md">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$emit('toggleWindow','bookSelector', false)"
        />
        <div class="flex direction-center items-center text-bold q-px-xs">
          Выбор книги - {{ bookFileName }}
        </div>
        <q-space/>
        <q-btn flat round icon="payments"/>
        <q-btn flat round icon="more_vert"/>
      </div>

      <q-separator color="separator" style="height: 2px"/>

      <q-scroll-area class="col">
        <div
          class="row bordered-buttons top"
          :class="textDirections.ot"
        >
          <q-btn
            v-for="book in oldTestamentBooks"
            :key="book.book_number"
            class="col-md-1 col-xs-2 col-sm-2"
            :style="{color: getColor(book.book_number)}"
            flat
            stretch
            no-caps
            :class="{ active: book.book_number === bookNumber }"
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
            :style="{color: getColor(book.book_number)}"
            :class="{ active: book.book_number === bookNumber }"
            :label="book.short_name"
            @click="firstStep(book.book_number, book.long_name)"
          />
        </div>
      </q-scroll-area>

    </div>
    <transition name="fade">
      <div
        v-if="isSecondStep"
        class="fit absolute-top bg-background column"
      >
        <div class="row q-pa-md">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click.stop="isSecondStep = false"
          />
          <div class="flex direction-center items-center text-bold q-px-xs">
            {{ selectedBookName }} - {{ bookFileName }}
          </div>
          <q-space/>
          <q-btn flat round icon="payments"/>
          <q-btn flat round icon="more_vert"/>
        </div>
        <q-separator color="separator" style="height: 2px"/>
        <q-scroll-area class="col">
          <div class="row bordered-buttons top">
            <q-btn
              v-for="chapter in countOfChapters"
              :key="chapter"
              class="col-md-1 col-xs-2 col-sm-2"
              unelevated
              stretch
              no-caps
              :class="{active: chapter === chapterNumber && selectedBookNumber === bookNumber}"
              :label="chapter"
              @click.once="secondStep(chapter)"
            />
          </div>
        </q-scroll-area>
      </div>
    </transition>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {defineComponent, ref, computed, inject} from "vue";

export default defineComponent({
  setup(props, {emit}) {
    const id = inject('id')

    const isSecondStep = ref(false)
    const countOfChapters = ref(0)
    const selectedBookNumber = ref(0)
    const selectedBookName = ref('')

    const newTestamentBooks = computed(() => props.booksList.filter(book => book.book_number >= 470))
    const oldTestamentBooks = computed(() => props.booksList.filter(book => book.book_number <= 460))

    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const secondStep = newChapterNumber => {
      const newRef = {
        bookNumber: selectedBookNumber.value,
        chapterNumber: newChapterNumber
      }
      changeModuleState({
        id,
        key: 'bible',
        settings: newRef
      })
      emit('toggleWindow', 'bookSelector', false)
    }

    const firstStep = async (bookNumber, bookFullName) => {
      const settings = {
        bookNumber,
        bookFileName: props.bookFileName
      }
      countOfChapters.value = await window.electron.invoke('get-count-of-chapters', settings)
      selectedBookNumber.value = bookNumber
      selectedBookName.value = bookFullName
      isSecondStep.value = true
    }

    const getColor = (book_number) => {
      return (book_number <= 50) ? 'teal'
        : (book_number <= 160 || book_number === 190) ? 'blue'
          : (book_number >= 220 && book_number <= 260) ? 'green'
            : (book_number >= 290 && book_number <= 460) ? 'brown'
              : (book_number >= 470 && book_number <= 500) ? 'orange'
                : (book_number === 510) ? 'Tomato'
                  : (book_number >= 520 && book_number <= 720) ? 'DarkTurquoise'
                    : (book_number === 730) ? 'Magenta'
                      : 'black'

    }

    return {
      newTestamentBooks,
      oldTestamentBooks,
      firstStep,
      secondStep,
      getColor,
      selectedBookName,
      countOfChapters,
      isSecondStep
    }
  },

  props: {
    booksList: {
      type: Object,
      required: true
    },
    bookFileName: String,
    bookFullName: String,
    chapterNumber: Number,
    bookNumber: Number,
    textDirections: String
  }
})
</script>

<style lang="scss">
.selector {
  color: var(--light);
  z-index: 2;

  .active {
    background: var(--active-bg);
  }

  .bordered-buttons {
    &.top {
      margin: 0 -1px 0 0;

      button {
        border-bottom: 1px solid var(--separator);
        border-right: 1px solid var(--separator);
      }

      &.rtl {
        margin: 0 0 0 -1px;
        direction: rtl;

        button {
          border-left: 1px solid var(--separator);
          border-right: none !important;
        }
      }
    }

    &.bottom {
      border-top: 1px solid var(--separator);
      margin: -1px -1px 0 0;

      button {
        border-bottom: 1px solid var(--separator);
        border-right: 1px solid var(--separator);
      }

      &.rtl {
        margin: -1px 0 0 -1px;
        direction: rtl;

        button {
          border-left: 1px solid var(--separator);
          border-right: none !important;
        }
      }
    }
  }
}
</style>
