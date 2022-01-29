<template>
  <UIModalWindow>

    <UIModalWindowHeader @click="close">
      <template #title>{{ bookShortName }} {{ chapterNumber }}:{{ convertVerses(selectedVerses) }} в разных местах</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>

    <UIModalWindowBody>
      <q-list separator>
        <q-item
          clickable
          v-ripple
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

<script>
import useStore from "src/hooks/useStore";
import {ref, computed, onMounted} from "vue";
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import useSevenBible from "src/hooks/useSevenBible";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody";
import {convertVerses} from "src/helpers";

export default {
  components: {UIModalWindowBody, UIModalWindowHeader, UIModalWindow},
  setup(props, {emit}) {
    const {id, bookShortName} = useSevenBible()
    const store = useStore()
    const {chapterNumber, bookNumber} = store.native.state.settings.workPlace[id].bible
    const testament = computed(() => props.bookNumber >= 470 ? 'nt' : 'ot')

    const close = (ref) => emit('close', ref)

    const goToModule = filename => {
      close({fileName: filename})
    }

    const translationsTexts = ref([])
    const getComparedTranslations = async () => {
      const settings = {
        bookNumber: bookNumber,
        chapterNumber: chapterNumber,
        versesNumbers: props.selectedVerses
      }
      translationsTexts.value = await window.bible.getCompared(settings)
    }
    onMounted(() => getComparedTranslations())

    return {
      bookShortName,
      testament,
      translationsTexts,
      chapterNumber,
      bookNumber,
      goToModule,
      close,
      convertVerses
    }
  },
  props: {
    selectedVerses: Array
  }
}
</script>
