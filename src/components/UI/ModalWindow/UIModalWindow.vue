<template>
  <div
    class="ui-modal-window flex d-column absolute fit overflow-hidden-y no-outline"
    v-focus
    @keydown.esc="$emit('close')"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  emits: ['close']
}
</script>
