<template>
  <div>
    <template
      v-for='(number, key, id) in strongNumbersInfo'
      :key='id'
    >
      <div class='text-bold' v-show='strongNumbers.length > 1'>{{ key.toUpperCase() }}</div>
      <div v-html='number.definition'></div>
      <template v-if="number.cognate.length">
        <q-separator class='q-my-xs'/>
        <div
          class="q-gutter-x-sm"
          style="word-break: break-all"
        >
          <span class="text-no-wrap">Однокоренные:</span>
          <span v-for='(cognate, i) in number.cognate' :key='i'>
              <a :href="'S:' + cognate">{{ cognate }}</a>
            </span>
        </div>
      </template>
    </template>

  </div>
</template>

<script>
import {onMounted, ref, watch} from "vue";

export default {
  setup(props) {
    const strongNumbersInfo = ref({})
    const searchInfo = async () => {
      const settings = {
        strongNumbers: [...props.strongNumbers],
        strongFileName: props.strongFileName
      }
      strongNumbersInfo.value = await window.electron.invoke('get-strong-numbers-info', settings)
    }

    onMounted(() => searchInfo())
    watch([
        () => props.strongNumbers,
        () => props.strongFileName],
      () => searchInfo())

    return {
      strongNumbersInfo
    }
  },
  props: {
    strongNumbers: {
      type: Array,
      required: true
    },
    strongFileName: String
  },
}
</script>
