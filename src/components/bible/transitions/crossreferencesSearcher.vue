<template>
  <div class='fit absolute-top transition bg-background column'>
    <div>
      <div class='row q-pa-md'>
        <q-btn
          flat
          round
          icon='arrow_back'
          @click="$emit('toggleWindow', 'crossreferencesSearcher', false)"
        />
        <div class='flex direction-center items-center text-bold q-px-xs'>
          {{ bookShortName }} {{ chapterNumber }}:{{ verse }} - ссылки
        </div>
        <q-space/>
        <q-btn flat round icon='payments'/>
        <q-btn flat round icon='more_vert'/>
      </div>
      <q-linear-progress color='blue' style='height: 2px' v-if='showLoader' query/>
      <q-separator v-else color='blue' style='height: 2px'/>
    </div>

    <q-scroll-area class='col'>
      <q-list separator bordered>
        <q-item
          clickable
          v-ripple
          v-for='(ref, idx) in crossreferences'
          :key='idx'
          @click="goToText(ref.book_to, ref.chapter_to)"
          :dir="ref.book_to >= 470 ? textDirections.nt : textDirections.ot"
        >
          <q-item-section>

            <q-item-label lines="1" class="q-gutter-x-md q-pb-sm">
              <bdo class="text-weight-light">{{ ref.module_name }}</bdo>
              <span>{{ getRefString(ref) }}</span>
            </q-item-label>

            <q-item-label>
              <div class="q-gutter-x-sm">
                <span
                  v-if="ref.expanded"
                  class="text-grey text-subtitle2 text-body2"
                >
                  {{ ref.texts[0].verse }}
                </span>

                <span v-html="{...ref.texts[0]}.text"></span>
              </div>
              <div
                id="el"
                style="transition: all .25s;max-height: 0;overflow: hidden;"
              >
                <div
                  v-for="(item, i) in ref.texts.slice(1)"
                  :key="i"
                  class="q-gutter-x-sm"
                >

                <span class="text-grey text-subtitle2 text-body2">
                  {{ item.verse  }}
                </span>

                  <span v-html="item.text"></span>

                </div>
              </div>
              <q-btn
                v-if="ref.texts.length > 1"
                flat
                class="full-width q-mt-sm"
                @click.stop="openPanel($event, ref.expanded, ref)"
              >
                <!--                <transition name="fade">-->
                <q-icon
                  v-if="ref.expanded"
                  key="less"
                  class="absolute-center"
                  name="expand_less"/>
                <q-icon
                  v-else
                  key="more"
                  class="absolute-center"
                  name="expand_more"/>
                <!--                </transition>-->

              </q-btn>
            </q-item-label>

          </q-item-section>

        </q-item>
      </q-list>
    </q-scroll-area>

  </div>
</template>

<script>
import { useStore} from 'vuex'
import {defineComponent, inject, onMounted, ref} from "vue";
import bookNamesFromNumber from 'src/hooks/bookNamesFromNumber'

export default defineComponent({
  setup(props, {emit}){
    const id = inject('id')
    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)

    const showLoader = ref(true)
    const crossreferencesCount =  ref(0)
    const crossreferences = ref([])

    const getCrosrefferences = async () => {
      const settings = {
        bookNumber: props.bookNumber,
        chapterNumber: props.chapterNumber,
        verse: props.verse,
        bookFileName: props.bookFileName
      }
      const data = await window.electron.invoke('get-crossreferences', settings)

      data.forEach(curr => {
        curr.bookName = bookNamesFromNumber(curr.book_to, props.booksList).bookShortName
      })
      data.sort((a, b) => {
        if (a.book_to === b.book_to) {
          if (a.chapter_to === b.chapter_to) { return a.verse_to_start - b.verse_to_start }
          return a.chapter_to - b.chapter_to
        } else return a.book_to - b.book_to
      })

      crossreferences.value = data
      crossreferencesCount.value = data.length
      showLoader.value = false
    }

    onMounted(() => getCrosrefferences())

    const getRefString = ref => `${ref.bookName} ${ref.chapter_to}:${ref.verse_to_start}${ref.verse_to_end === 0 ? '' : '-' + ref.verse_to_end}`

    const openPanel = ({ target }, expanded, ref) => {
      while (target.className !== 'q-item__label') {
        target = target.parentNode
      }
      const eToExpand = target.querySelector('#el')

      if (expanded) {
        eToExpand.style.maxHeight = 0
        setTimeout(() => { ref.expanded = !ref.expanded }, 100)
      } else {
        eToExpand.style.maxHeight = eToExpand.scrollHeight + 8 + 'px'
        ref.expanded = !ref.expanded
      }
    }

    const goToText = (bookNumber, chapterNumber) => {
      changeModuleState({
        id,
        key: 'bible',
        settings: { bookNumber, chapterNumber }
      })
      emit('toggleWindow', 'crossreferencesSearcher')
    }

    return {goToText, getRefString, openPanel, showLoader, crossreferencesCount, crossreferences}
  },
  props: {
    bookNumber: Number,
    chapterNumber: Number,
    verse: Number,
    bookShortName: String,
    bookFileName: String,
    booksList: {
      type: Array,
      required: true
    },
    textDirections: String
  }
})
</script>
