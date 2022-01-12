<template>
  <div style="transition: 0.2s" class="q-gutter-y-sm">

    <div v-if="chapterNumber === 1 && (detailedInfo?.length || moduleIntroduction.length)">

              <span
                class='introduction text-h6'
                @click='moduleIntroductionWindow = true'
              >
                {{ introductionString || "Введение" }}
            </span>

      <q-dialog v-model='moduleIntroductionWindow'>
        <q-card>

          <q-card-section class='row q-pb-none'>
            <span class='text-h6'>{{ description }}</span>
            <q-space/>
            <q-btn icon='close' flat round dense v-close-popup/>
          </q-card-section>

          <q-separator/>

          <q-card-section class="scroll-container" style="max-height: 50vh">
            <span v-html='detailedInfo'/>

            <template v-if="moduleIntroduction.length">
              <q-separator/>
              <span v-html='moduleIntroduction'></span>
            </template>

          </q-card-section>

        </q-card>
      </q-dialog>
    </div>

    <div>
      <span
        class='book-name text-h4'
        :class="{introduction: bookIntroduction}"
        @click="() => {if (bookIntroduction) bookIntroductionWindow = true}"
      >
      {{ bookFullName }}
      </span>

      <q-dialog v-model="bookIntroductionWindow">
        <q-card>

          <q-card-section class='row q-pb-none'>
            <div class='text-h6'>{{ bookFullName }}</div>
            <q-space/>
            <q-btn icon='close' flat round dense v-close-popup/>
          </q-card-section>

          <q-separator/>

          <q-card-section
            v-html='bookIntroduction'
            class="scroll-container"
            style="max-height: 50vh"
          />

        </q-card>
      </q-dialog>

    </div>

    <div
      class='chapter-number text-h4'
    >
      {{
        String.hasReplacer(chapterString) ? chapterString.format(chapterNumber) : `${chapterString} ${chapterNumber}`
      }}
    </div>

  </div>
</template>

<script>

import {defineComponent, watch, onMounted, ref} from "vue";

export default defineComponent({
  setup(props) {
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
        if (item.book_number === 0) {
          moduleIntroduction.value = item.introduction
        }
        if (item.book_number === settings.bookNumber && !item.chapter_number) {
          bookIntroduction.value = item.introduction
        }
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
