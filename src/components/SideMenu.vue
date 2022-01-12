<template>
  <div
    class="layout-sidebar shrink-0 border-left"
    v-show="visibleRight"
  >
      <q-list class="full-height overlay-y">

        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            :to="menuItem.path"
            clickable
            exact
            v-ripple
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{t(menuItem.label)}}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
        </template>

      </q-list>
    </div>
</template>

<script>
import { menuList } from 'src/objects/menu.js'
import {useI18n} from "vue-i18n";

export default {
	setup() {
    const {t} = useI18n()
		return {
			menuList,
      t
		}
	},
	props: {
		visibleRight: Boolean,
	},
}
</script>
