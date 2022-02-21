<template>
  <div>
    <div class="q-pa-sm flex q-gutter-x-sm">
      <slot name="close"/>
      <q-btn
        v-if="!$slots.close"
        flat
        round
        :icon='Icons.PrevChapter'
        @click="$emit('close')"
      />
      <span class='flex items-center text-bold ellipsis'>
       <slot name="title"/>
    </span>
      <q-space/>

      <slot/>
    </div>
    <q-separator v-if="props.bordered"/>
  </div>
</template>

<script setup lang="ts">
import {Icons} from "src/types/icons";

interface Props {
  bordered?: boolean
}
const props = withDefaults(defineProps<Props>(), {bordered: true})
const emit = defineEmits(['close'])
</script>
