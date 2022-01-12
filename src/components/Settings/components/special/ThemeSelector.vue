<template>
  <q-select
    outlined
    :hint="description"
    :model-value="value"
    :options="themeList"
    @update:model-value="(event) => {
      onSelect(event)
      setTheme(event)
    }"
  />
</template>

<script>
import useTheme from "src/hooks/useTheme";

export default {
  async setup(props) {
    const {getAllThemes, setTheme} = useTheme()

    const onSelect = (value) => props.store.state.set(`app.${props.config.path}`, value)
    let themeList = await getAllThemes()

    return {
      themeList,
      setTheme,
      onSelect
    }
  },
  props: {
    config: {
      required: true
    },
    value: {
      type: String,
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
