<template>
    <q-checkbox
      size="5rem"
      :model-value="value"
      :label="description"
      @update:model-value="onUpdate"
    />
</template>

<script>
export default {
  setup(props){

    const onUpdate = (value) => props.store.state.set(`app.${props.config.path}`, value)

    return{
      onUpdate
    }
  },
  props: {
    config: {
      required: true
    },
    value: {
      type:  Boolean,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    store: Object
  }
}
</script>

