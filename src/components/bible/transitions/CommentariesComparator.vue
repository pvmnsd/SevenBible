<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>{{ bookShortName }} {{ chapterNumber }}: {{ verseNumber }} - Комментарии</template>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <UILoader v-if="loading"/>
      <q-list v-else-if="compared.length" separator>
        <q-item
          v-for="(item, i) in compared"
          :key="i"
        >
          <q-item-section>
            <q-item-label class="text-bold" v-text="item.filename"/>
            <q-item-label v-html="item.text"/>
          </q-item-section>
        </q-item>
      </q-list>
      <UIError v-else v-text="$t('nothingFounded')"/>
    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script lang="ts">
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader.vue";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import useSevenBible from "src/hooks/useSevenBible";
import {onMounted, ref, defineComponent, Ref, nextTick} from "vue";
import {Commentaries} from "src-e/types/commentaries";
import UIError from "components/UI/UIError.vue";
import UILoader from "components/UI/UILoader.vue";

export default defineComponent({
  setup(props, {emit}) {
    const {bookShortName, bible: {value: {chapterNumber, bookNumber}}} = useSevenBible()

    const loading = ref(false)
    const close = () => emit('close')
    const compared: Ref<Commentaries[]> = ref([])
    const getCompared = async () => {
      const settings = {
        bookNumber,
        chapterNumber,
        verseNumber: props.verseNumber
      }
      loading.value = true
      compared.value = await window.api.commentaries.getCompared(settings)
      nextTick(() => loading.value = false)
    }

    onMounted(() => getCompared())

    return {
      close,
      loading,
      bookShortName,
      chapterNumber,
      compared
    }
  },
  props: {
    verseNumber: Number
  },
  components: {UILoader, UIError, UIModalWindowBody, UIModalWindowHeader, UIModalWindow}
})
</script>
