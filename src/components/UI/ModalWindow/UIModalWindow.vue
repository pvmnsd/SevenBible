<template>
  <div
    class="ui-modal-window flex d-column absolute fit overflow-hidden-y no-outline"
    v-focus
    @keydown.esc="$emit('close')"
    :class="{'background-transparent': transparent}"
    @click="onCLick"
  >
    <slot/>
  </div>
</template>

<script setup lang="ts">

interface Props {
  transparent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  transparent: false
})

const emit = defineEmits(['close'])

const onCLick = (event: any) => {
  if (
    props.transparent &&
    event.target.parentElement.classList.contains('ui-modal-window')
    || event.target.classList.contains('ui-modal-window')
  )
    emit('close')
}

</script>
