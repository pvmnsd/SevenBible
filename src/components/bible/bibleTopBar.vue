<template>
  <div class="col-auto">

    <div class='row no-wrap bg-secondary-bg'>
      <ModuleSelector
        :file-name="bookFileName"
        :path="['modules', 'books']"
        module="bible"
      />
      <template v-if="activeBibleModulesIndexes.length > 1">
        <q-separator vertical color='separator'/>
        <q-btn
          class='col-auto'
          icon="close"
          stretch
          unelevated
          @click.stop="closeWindow"
        />
      </template>

      <q-separator vertical color='separator'/>

      <q-btn
        class='col'
        :label='`${bookShortName ?? "..."} ${chapterNumber}`'
        no-caps
        stretch
        unelevated
        @click.stop="$emit('toggleWindow','bookSelector',true)"
      />

      <q-separator vertical color='separator'/>

      <q-btn
        class='col-auto'
        stretch
        unelevated
        icon='search'
        @click="$emit('toggleWindow','bookSearcher', true)"
      />

      <q-separator vertical color='separator'/>

      <q-btn
        class='col-auto'
        no-caps
        icon='navigate_before'
        :disable='arrows.before.disabled'
        stretch
        unelevated
        @click='onNavigateClick("before")'
      />

      <q-separator vertical color='separator'/>

      <q-btn
        class='col-auto'
        no-caps
        icon='navigate_next'
        :disable='arrows.next.disabled'
        stretch
        unelevated
        @click='onNavigateClick("next")'
      />
      <q-separator vertical color='separator'/>

      <quick-settings :bible-view="bibleView"/>

    </div>
    <q-separator color='separator'/>
  </div>
</template>

<script>
import QuickSettings from 'components/bible/topBar/quickSettings.vue'
import ModuleSelector from 'components/bible/ModuleSelector.vue'
import {useStore} from 'vuex'
import {inject, onMounted, ref, watch} from "vue";

export default {
  setup(props) {
    const id = inject('id')

    const arrows = ref({
      next: {ref: null, disabled: true},
      before: {ref: null, disabled: true}
    })

    const store = useStore()
    const changeModuleState = settings => store.commit('settings/changeModuleState', settings)
    const closeWindow = () => {
      store.commit('settings/closeWindow', id)
      const settings = {
        bookFileName: props.bookFileName,
        activeBibleModules: store.getters["settings/bibleActiveModules"].map(e => e.bookFileName)
      }
      window.electron.invoke('close-db-connection', settings)
    }

    const onNavigateClick = btn => {
      changeModuleState({
        id,
        key: 'bible',
        settings: arrows.value[btn].ref
      })
    }
    const getState = async () => {
      const settings = {
        bookNumber: props.bookNumber,
        chapterNumber: props.chapterNumber,
        bookFileName: props.bookFileName
      }
      const data = await window.electron.invoke('get-top-bar-state', settings)
      arrows.value = data.arrows
    }

    onMounted(() => getState())
    watch(() => props.refString, () => getState())

    const activeBibleModulesIndexes = inject('activeBibleModulesIndexes')

    return {
      arrows,
      onNavigateClick,
      closeWindow,
      activeBibleModulesIndexes
    }
  },
  components: {QuickSettings, ModuleSelector},
  props: {
    bibleView: Object,
    refString: String,
    bookNumber: Number,
    chapterNumber: Number,
    bookFileName: String,
    bookShortName: String
  }
}
</script>
