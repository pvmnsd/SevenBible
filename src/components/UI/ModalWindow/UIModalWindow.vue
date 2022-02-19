<template>
  <div
    class="ui-modal-window flex d-column absolute fit overflow-hidden-y no-outline"
    v-focus
    @keydown.esc="$emit('close')"
    :class="{'background-transparent': transparent}"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  props: {
    transparent: {
      type: Boolean,
      default: false
    }
  }
}
</script>
