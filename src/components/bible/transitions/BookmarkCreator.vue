<template>
  <UIModalWindow>
    <UIModalWindowHeader @close="close">
      <template #title>Закладка</template>
      <q-btn disable flat round icon='more_vert'/>
    </UIModalWindowHeader>
    <UIModalWindowBody>
      Holla
    </UIModalWindowBody>
  </UIModalWindow>
</template>

<script>
import UIModalWindow from "components/UI/ModalWindow/UIModalWindow";
import UIModalWindowHeader from "components/UI/ModalWindow/UIModalWindowHeader";
import UIModalWindowBody from "components/UI/ModalWindow/UIModalWindowBody";
import useSevenBible from "src/hooks/useSevenBible";

export default {
  setup() {
    const {transitions} = useSevenBible()
    const close = () => transitions.bookmarkCreator = false

    return {
      close
    }
  },
  components: {UIModalWindowBody, UIModalWindowHeader, UIModalWindow}
}
</script>
