<template>
  <q-drawer
    :model-value="drawer"
    elevated
    :width="200"
    :breakpoint="0"
    behavior="default"
    side="right"
    class="bg-secondary-bg"
  >
    <q-scroll-area class="fit">
      <q-list>

        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            :active="menuItem.label === 'Outbox'"
            :to="menuItem.path"
            v-ripple
            exact
            active-class='text-active-text'
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon"/>
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="menuItem.separator"/>
        </template>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { menuList } from 'src/objects/menu'
import { defineComponent } from "vue"

export default defineComponent({
  name: "Drawer",
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    return {
      menuList
    }
  }
})
</script>
