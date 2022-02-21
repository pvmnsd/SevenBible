<template>
  <UIModalWindow @close="close">
    <UIModalWindowHeader @close="close">
      <template #title><span v-text="$t('bookmarksManager')"/></template>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      <h2>Holla Bolla!</h2>
    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script setup lang="ts">
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow.vue";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody.vue";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader.vue";

const emit = defineEmits(['close'])
const close = () => emit('close')

</script>
