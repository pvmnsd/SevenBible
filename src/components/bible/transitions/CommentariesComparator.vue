<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>{{ bookShortName }} {{ chapterNumber }}: {{ verseNumber }} - Комментарии</template>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <div v-for="(item, i) in compared" :key="i">
        <b>{{ item.filename }}</b>
        <p v-html="item.text"/>
      </div>
    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script>
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody";
import useSevenBible from "src/hooks/useSevenBible";
import {onMounted, ref} from "vue";

export default {
  setup(props, {emit}) {
    const {bookShortName, bible: {value: {chapterNumber, bookNumber}}} = useSevenBible()
    const close = () => emit('close')
    const compared = ref(null)
    const getCompared = async () => {
      const settings = {
        bookNumber,
        chapterNumber,
        verseNumber: props.verseNumber
      }
      compared.value = await window.commentaries.getCompared(settings)
    }

    onMounted(() => getCompared())

    return {
      close,
      bookShortName,
      chapterNumber,
      compared
    }
  },
  props: {
    verseNumber: Number
  },
  components: {UIModalWindowBody, UIModalWindowHeader, UIModalWindow}
}
</script>
