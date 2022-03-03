<template>
  <UIModalWindow>

    <UIModalWindowHeader @click="close">
      <template #title>{{ bookShortName }} {{ chapterNumber }}:{{ convertVerses(selectedVerses) }} в разных местах
      </template>
      <q-btn disable flat round :icon='Icons.Dots'/>
    </UIModalWindowHeader>

    <UIModalWindowBody>
      <q-list separator class="overlay">
        <q-item
          clickable
          v-for="(item, i) in translationsTexts"
          :key="i"
          @click="goToModule(item.moduleName)"
          :dir="item.direction[testament]"
        >
          <q-item-section>
            <q-item-label
              class="q-gutter-x-md q-pb-sm"
            >
              <span class="text-weight-bold">{{ item.moduleName }}</span>
              <span class="text-weight-light">{{ item.moduleDescription }}</span>
            </q-item-label>

            <q-item-label>
              <p v-for="(item1, i) in item.texts" :key="'text-' + i" class="q-gutter-x-sm">
                <span v-if="item.texts.length > 1" v-text="item1.verse"/>
                <span v-html="item1.text"/>
              </p>
            </q-item-label>

          </q-item-section>
        </q-item>
      </q-list>
    </UIModalWindowBody>

  </UIModalWindow>
</template>

<script setup lang="ts">
import {ref, PropType, onMounted} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader.vue";
import useSevenBible from "src/hooks/useSevenBible";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import {convertVerses} from 'src/helpers/verseSelector'
import {Icons} from "src/types/icons";

const props = defineProps({
  selectedVerses: {
    type: Array as PropType<number[]>,
    required: true
  }
})
const emit = defineEmits(['close'])

const {bookShortName, bible} = useSevenBible()
const {bookNumber, chapterNumber} = bible!.value!

const testament = bookNumber >= 470 ? 'nt' : 'ot'

const close = (ref: any) => emit('close', ref)

const goToModule = (filename: string) => {
  close({fileName: filename})
}

const translationsTexts = ref([])
const getComparedTranslations = async () => {
  const settings = {
    bookNumber: bookNumber,
    chapterNumber: chapterNumber,
    versesNumbers: [...props.selectedVerses]
  }
  translationsTexts.value = await window.api.bible.getCompared(settings)
}
onMounted(() => getComparedTranslations())

</script>
