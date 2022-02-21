<template>
  <UIModalWindow @close="close">
    <UIModalWindowHeader @close="close">
      <template #title>{{ bookShortName }} {{ chapterNumber }}:{{ selectedVerses[0] }} - ссылки</template>
      <q-btn flat round :icon='Icons.Dots'/>
    </UIModalWindowHeader>

    <UIModalWindowBody>

      <DynamicVirtualScroller
        :items="crossreferences"
        class="overlay separated"
      >
        <template v-slot="{item}">
          <q-item
            clickable
            @click="goToText(item.book_to, item.chapter_to)"
            :dir="item.book_to >= 470 ? textDirections.nt : textDirections.ot"
          >
            <q-item-section>

              <q-item-label lines="1" class="q-gutter-x-md q-pb-sm">
                <bdi class="text-weight-light">{{ item.module_name }}</bdi>
                <span>{{
                    `${item.bookShortName} ${item.chapter_to}:${item.verse_to_start}${item.verse_to_end === 0 ? '' : '-' + item.verse_to_end}`
                  }}</span>
              </q-item-label>

              <q-item-label>
                <div class="q-gutter-x-sm">
                <span
                  v-if="item.expanded"
                  class="text-subtitle2 text-body2"
                >
                  {{ item.texts[0].verse }}
                </span>

                  <span v-html="{...item.texts[0]}.text"></span>
                </div>
                <div
                  id="el"
                  style="transition: all .25s;max-height: 0;overflow: hidden;"
                >
                  <div
                    v-for="(firstVerse, i) in item.texts.slice(1)"
                    :key="i"
                    class="q-gutter-x-sm"
                  >

                <span class="text-subtitle2 text-body2">
                  {{ firstVerse.verse }}
                </span>

                    <span v-html="firstVerse.text"></span>

                  </div>
                </div>
                <q-btn
                  v-if="item.texts.length > 1"
                  flat
                  class="full-width q-mt-sm"
                  @click.stop="openPanel($event, item.expanded, item)"
                >
                  <!--                <transition name="fade">-->
                  <q-icon
                    v-if="item.expanded"
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
        </template>
      </DynamicVirtualScroller>

    </UIModalWindowBody>

  </UIModalWindow>
</template>

<script setup lang="ts">
import useStore from "src/hooks/useStore";
import {onMounted, ref} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader.vue";
import useSevenBible from "src/hooks/useSevenBible";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import DynamicVirtualScroller from "components/wrappers/DynamicVirtualScroller.vue";
import {Icons} from "src/types/icons";

interface Props {
  selectedVerses: number[]
}
const props = defineProps<Props>()
const emit = defineEmits(['close'])

const {id, textDirections, bookShortName} = useSevenBible()
const close = (ref: any) => emit('close', ref)
const store = useStore()

const {
  bookNumber,
  chapterNumber,
  fileName: bibleFileName
} = store.native.state.settings.workPlace[id].bible

const crossreferences = ref([])

const getCrosrefferences = async () => {
  const settings = {
    bookNumber: bookNumber,
    chapterNumber: chapterNumber,
    verse: props.selectedVerses[0],
    filename: bibleFileName
  }
  let data = await window.api.crossreferences.getCrossreferences(settings)

  data.sort((a: any, b: any) => {
    if (a.book_to === b.book_to) {
      if (a.chapter_to === b.chapter_to) {
        return a.verse_to_start - b.verse_to_start
      }
      return a.chapter_to - b.chapter_to
    } else return a.book_to - b.book_to
  })

  crossreferences.value = data
}

onMounted(() => getCrosrefferences())

const openPanel = ({target}: any, expanded: boolean, ref: any) => {
  while (target.className !== 'q-item__label') {
    target = target.parentNode
  }
  const eToExpand = target.querySelector('#el')

  if (expanded) {
    eToExpand.style.maxHeight = 0
    setTimeout(() => {
      ref.expanded = !ref.expanded
    }, 100)
  } else {
    eToExpand.style.maxHeight = eToExpand.scrollHeight + 8 + 'px'
    ref.expanded = !ref.expanded
  }
}

const goToText = (bookNumber: number, chapterNumber: number) => {
  close({bookNumber, chapterNumber})
}

</script>
