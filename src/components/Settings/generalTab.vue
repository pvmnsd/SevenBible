<template>
  <div class="flex full-height">
    <q-tree
      :nodes="configurationList"
      style="width: 150px; word-break: break-word"
      node-key="label"
      class="overlay-y q-ml-lg"
      selected-color="primary"
      v-model:selected="selected"
      ref="tree"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div>{{ t(prop.node.label) }}</div>
        </div>
      </template>
    </q-tree>

    <q-separator vertical class="q-mx-md"/>
    <suspense>
      <div class="scroll grow-1 q-pa-sm" ref="root">
        <div
          v-for="(config, i) in configurationList"
          :key="i"
        >
        <span
          class="text-h2"
          :data-label="config.label"
          v-intersection="categoryIntersectionOptions"
        >
          #{{ t(config.label) }}
        </span>

          <span v-if="config.description" v-text="t(config.description)"/>

          <div
            v-for="(childConfig, i) in config.children"
            :key="i"
            class="q-pb-lg"
          >
            <div class="text-h5">{{ t(childConfig.label) }}</div>
            <component
              :store="store"
              :is="childConfig.component"
              :config="childConfig"
              :value="Object.getValue(childConfig.path, app)"
              :description="childConfig.description ? t(childConfig.description) : null"
            />
          </div>
          <q-separator v-if="i + 1 !== configurationList.length"/>
        </div>
      </div>
    </suspense>

  </div>
</template>

<script>
import useStore from "src/hooks/useStore";
import {ref} from "vue";
import configurationList from "src/settings/configurationList";
import {useI18n} from "vue-i18n";
import Input from "components/Settings/components/universal/Input";
import Select from "components/Settings/components/universal/Select";
import FontSelector from "components/Settings/components/special/FontSelector";
import ThemeSelector from "components/Settings/components/special/ThemeSelector";
import Checkbox from "components/Settings/components/universal/Checkbox";
export default {
  components: {
    Input,
    Checkbox,
    Select,
    FontSelector,
    ThemeSelector,
  },
  setup() {
    const {t} = useI18n()
    const store = useStore()

    const themes = [
      {
        label: 'Светлая',
        value: 'light'
      },
      {
        label: 'Темная',
        value: 'dark'
      }
    ]
    const app = store.state.getReactive('app')



    const tree = ref(null)
    const selected = ref(configurationList[0].label)

    const categoryIntersectionOptions = {
      handler: (entry, cfg) => {
        const label = entry.target.dataset.label

        // tree.value.setExpanded(label, tree)
      },
      cfg: {
        threshold: 1
      }
    }

    return {
      themes,
      configurationList,
      t,
      categoryIntersectionOptions,
      selected,
      app,
      store
    }

  }
}
</script>
