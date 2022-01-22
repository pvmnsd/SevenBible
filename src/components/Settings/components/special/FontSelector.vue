<template>
  <q-select
    outlined
    :config="config"
    :model-value="value"
    :options="options"
    :description="description"
    use-input
    input-debounce="0"
    @update:model-value="onSelect"
    @filter="filterFn"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section :style="{fontFamily: scope.label}">
          <q-item-label>{{scope.label}}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import {ref} from "vue";

export default {
  async setup(props) {
    const onSelect = (value) =>
      props.store.state.set(`app.${props.config.path}`, value)
    const fontList = await window.system.getFontList()
    let options = ref([...fontList])

    const filterFn =  (val, update, abort) => {
      update(() => {
        const needle = val.toLowerCase()
        options.value = fontList.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }

    return {
      options,
      filterFn,
      onSelect
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

