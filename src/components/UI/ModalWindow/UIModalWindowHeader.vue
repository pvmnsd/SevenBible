<template>
  <div>
    <div class="q-pa-sm flex q-gutter-x-sm">
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
  }
}
</script>
