<template>
  <q-dialog
    :model-value="true"
    persistent
    seamless
    class="non-selectable"
  >
    <q-page-sticky :offset="positions">
      <q-card
        class="bg-primary text-white"
        style="width: 300px"
        ref="card"
      >
        <q-bar class="cursor-move" v-touch-pan.prevent.mouse="onPane">
          <div>{{ title }}</div>
          <q-space/>
          <q-btn dense flat icon="close" v-close-popup/>
        </q-bar>
        <slot/>
      </q-card>
    </q-page-sticky>
  </q-dialog>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  title: String
})

const positions = ref([10, 10])

const card = ref()

const onPane = (event) => {
  const {x, y} = event.delta
  const [prevX, prevY] = positions.value

  const nextX = prevX - x
  const nextY = prevY - y

  const {clientHeight, clientWidth} = card.value?.$el

  positions.value = [
    nextX >= window.innerWidth - clientWidth || nextX <= 0 ? prevX : nextX,
    nextY >= window.innerHeight - clientHeight - 32 || nextY <= 0 ? prevY : nextY,
  ]
}
</script>
