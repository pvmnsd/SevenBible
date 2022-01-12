<template>
  <q-input
    outlined
    :hint="description"
    :model-value="value"
    :type="config.type === 'number' ? 'number' : 'text'"
    @update:model-value="onInput"
  />
</template>

<script>
import {debounce} from "quasar";

export default {
  setup(props) {

    const onInput = debounce((value) => {
      if (props.config.type === 'number') {
        if (isNaN(value))
          return
        value = parseInt(value)
      }

      props.store.state.set(`app.${props.config.path}`, value)
    }, 500)

    return {
      onInput
    }
  },
  props: {
    config: {
      required: true
    },
    value: {
      type: [String, Number],
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
