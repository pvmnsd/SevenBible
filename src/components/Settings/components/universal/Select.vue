<template>
  <q-select
    outlined
    :hint="description"
    :model-value="t(value)"
    :options="config.enum"
    @update:model-value="onSelect"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{t(scope.label)}}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import {useI18n} from "vue-i18n";

export default {
  setup() {
    const {t} = useI18n()
    const onSelect =() => null
    return {
      t,
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
    }
  }
}
</script>
