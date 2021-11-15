<template>
  <div style="transition: 0.2s">

    <div v-if="chapterNumber === 1 && (detailedInfo?.length || moduleIntroduction.length)">

              <span
                class='introduction'
                style="font-size: 1.3em"
                @click='moduleIntroductionWindow = true'
              >
                {{ introductionString || "Введение" }}
            </span>

      <q-dialog v-model='moduleIntroductionWindow'>
        <q-card style="word-wrap: break-word">
          <q-card-section class='row items-center q-pb-none bg-background'>
            <div class='text-h6'>{{ description }}</div>
            <q-space/>
            <q-btn icon='close' flat round dense v-close-popup/>
          </q-card-section>

          <q-card-section v-html='detailedInfo'></q-card-section>

          <div v-if="moduleIntroduction.length">

            <q-card-section>
              <q-separator color="separator"/>
            </q-card-section>

            <q-card-section v-html='moduleIntroduction'></q-card-section>

          </div>

        </q-card>
      </q-dialog>
    </div>

    <div>
      <span
        class='book-name'
        style="font-size: 2.5em"
        :class="{introduction: bookIntroduction}"
        @click="() => {if (bookIntroduction) bookIntroductionWindow = true}"
      >
      {{ bookFullName }}
      </span>

      <q-dialog v-model="bookIntroductionWindow">
        <q-card style="word-wrap: break-word">

          <q-card-section class='row items-center q-pb-none bg-background'>
            <div class='text-h6'>{{ bookFullName }}</div>
            <q-space/>
            <q-btn icon='close' flat round dense v-close-popup/>
          </q-card-section>

          <q-card-section v-html='bookIntroduction'></q-card-section>

        </q-card>
      </q-dialog>

    </div>

    <span
      class='chapter-number'
      style="font-size: 2em"
    >
      {{ String.hasReplacer(chapterString) ? chapterString.format(chapterNumber) : `${chapterString} ${chapterNumber}` }}
    </span>

  </div>
</template>

<script>

import {defineComponent, watch, onMounted, ref} from "vue";

export default defineComponent({
  setup(props){
    const moduleIntroductionWindow = ref(false)
    const bookIntroductionWindow = ref(false)
    const chapterIntroductionWindow = ref(false)
    const moduleIntroduction = ref('')
    const bookIntroduction = ref('')
    const chapterIntroduction = ref(null)

    const getIntroductions = async () => {
      moduleIntroduction.value = ''
      bookIntroduction.value = ''
      const settings = {
        chapterNumber: props.chapterNumber,
        bookNumber: props.bookNumber,
        bookFileName: props.bookFileName
      }
      const data = await window.electron.invoke('get-introductions', settings)

      data?.forEach(item => {
        if (item.book_number === 0) { moduleIntroduction.value = item.introduction }
        if (item.book_number === settings.bookNumber && !item.chapter_number) { bookIntroduction.value = item.introduction }
      })
    }

    onMounted(() => getIntroductions())
    watch(() => props.refString, () => getIntroductions())

    return {
      moduleIntroductionWindow,
      bookIntroductionWindow,
      chapterIntroductionWindow,
      chapterIntroduction,
      moduleIntroduction,
      bookIntroduction
    }
  },

  props: {
    chapterString: String,
    bookNumber: Number,
    chapterNumber: Number,
    bookFullName: String,
    description: String,
    introductionString: String,
    detailedInfo: String,
    refString: String,
    bookFileName: String
  }
})
</script>
