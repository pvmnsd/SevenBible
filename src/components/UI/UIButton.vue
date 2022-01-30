<template>
  <q-btn
    no-caps
    no-wrap
    stretch
    unelevated
    :title="tooltip"
    :icon="icon"
    :label="label"
    :disable="disable"
  ><slot/></q-btn>
</template>

<script>
export default {
  props: {
    icon: String,
    label: String,
    disable: Boolean,
    tooltip: String
  }
}
</script>
