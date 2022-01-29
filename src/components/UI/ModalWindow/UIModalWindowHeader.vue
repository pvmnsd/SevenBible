<template>
  <div>
    <div class="q-pa-sm flex q-gutter-x-sm">
      <slot name="close"/>
      <q-btn
        v-if="!$slots.close"
        flat
        round
        icon='arrow_back'
        @click="$emit('close')"
      />
      <span class='flex items-center text-bold ellipsis'>
       <slot name="title"/>
    </span>
      <q-space/>

      <slot/>
    </div>
    <q-separator v-if="bordered"/>
  </div>
</template>

<script>
export default {
  props: {
    bordered: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close']
}
</script>
