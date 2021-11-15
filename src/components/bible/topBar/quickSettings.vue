<template>
  <q-btn-dropdown
    class='col-auto without-icon'
    no-caps
    icon='more_vert'
    stretch
    unelevated
    :menu-offset="[1, 1]"
  >
    <q-tab-panels :model-value="panel" >
      <q-tab-panel name="show">
        <div class="q-py-sm q-px-md no-selectable column">
          <div class="row content-between no-wrap q-gutter-x-sm">
            <q-btn
              icon="arrow_left"
              round
              unelevated
            />
            <span class="text-center text-h6">Показывать</span>
            <q-btn
              icon="arrow_right"
              round
              unelevated
              @click="showNextPanel('show')"
            />
          </div>
          <q-checkbox
            @update:model-value="changeViewState('showBookName',$event)"
            :model-value="bibleView.showBookName"
            label="название книги"
          />
          <q-checkbox
            @update:model-value="changeViewState('showChapterNumber', $event)"
            :model-value="bibleView.showChapterNumber"
            label="номер главы"
          />
          <div class="flex no-wrap">
            <q-checkbox
              @update:model-value="changeViewState('showSubheadings', $event)"
              :model-value="bibleView.showSubheadings"
              label="подзаголовки"
            />
            <q-btn
              class="q-ml-md"
              round
              flat
              size="xs"
              icon="settings"
              @click="$parent.$emit('toggleWindow', 'subheadingsSettings')"
            />
          </div>
          <div class="flex no-wrap">
            <q-checkbox
              @update:model-value="changeViewState('showCommentaries', $event)"
              :model-value="bibleView.showCommentaries"
              label="комментарии"
            />
            <q-space/>
            <q-btn
              class="q-ml-md"
              round
              flat
              size="xs"
              icon="settings"
              @click="$parent.$emit('toggleWindow', 'commentariesSettings')"
            />
          </div>
          <q-checkbox
            @update:model-value="changeViewState('showVerseNumber', $event)"
            :model-value="bibleView.showVerseNumber"
            label="нумерацию стихов"
          />
          <q-separator color="separator"/>

          <q-checkbox
            @update:model-value="changeViewState('showParagraphs', $event)"
            :model-value="bibleView.showParagraphs"
            label="абзацы и отступы"
            disable
          />
          <q-checkbox
            @update:model-value="changeViewState('showContinuousText', $event)"
            :model-value="bibleView.showContinuousText"
            label="непрерывный текст"
          />
          <q-separator color='separator'/>
          <q-checkbox
            @update:model-value="changeViewState('showStrongNumbers', $event)"
            :model-value="bibleView.showStrongNumbers"
            label="номера стронга"
          />
          <q-checkbox
            @update:model-value="changeViewState('showDreamy', $event)"
            :model-value="bibleView.showDreamy"
            label="сноски"
          />
          <q-checkbox
            @update:model-value="changeViewState('showJesusWords', $event)"
            :model-value="bibleView.showJesusWords"
            label="слова Иисуса"
          />
          <q-separator color="separator" class="q-my-sm"/>
          <div class="flex justify-center">
            <div>
              <q-btn
                icon="add"
                @click="changeFontSize('+')"
              />
              <q-btn
                @click="changeFontSize('-')"
                icon="remove"
              />
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="open">
        <div class="row content-between q-gutter-x-sm no-wrap">
          <q-btn
            icon="arrow_left"
            round
            unelevated
          />
          <span class="text-center text-h6">Открыть</span>
          <q-btn
            icon="arrow_right"
            round
            unelevated
            @click="showNextPanel('open')"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-btn-dropdown>
</template>

<script>
import {useStore} from 'vuex'
import {defineComponent, onMounted, onBeforeUnmount, inject, ref} from "vue"

export default defineComponent({
  setup(props) {
    const id = inject('id')

    const panels = ['show', 'open']
    const panel = ref('show')

    const showNextPanel = current => {
      const index = panels.indexOf(current)
      panel.value =  panels.length > index + 1 ? panels[index + 1] : panels[0]
    }

    const store = useStore()
    const changeModuleStateView = settings => store.commit('settings/changeModuleStateView', settings)
    const changeViewState = (name, value) => {
      if (name === 'showParagraphs') {
        if (props.bibleView.showContinuousText) {
          changeModuleStateView({id, key: 'bible', name: 'showContinuousText', value: false})
        }
        this.changeModuleStateView({id, key: 'bible', name, value})
      }
      if (name === 'showContinuousText') {
        if (props.bibleView.showParagraphs) {
          changeModuleStateView({id, key: 'bible', name: 'showParagraphs', value: false})
        }
        changeModuleStateView({id, key: 'bible', name, value})
      } else changeModuleStateView({id, key: 'bible', name, value})
    }
    const changeFontSize = (event) => {
      const nextFontSize = event === '+' ? props.bibleView.fontSize + 1 : props.bibleView.fontSize - 1
      changeModuleStateView({id, key: 'bible', name: 'fontSize', value: nextFontSize})
    }
    const keyListener = ({keyCode}) => {
      if (keyCode === 107) {
        changeFontSize('+')
      } else if (keyCode === 109) {
        changeFontSize('-')
      }
    }

    onMounted(() => window.addEventListener('keyup', keyListener))
    onBeforeUnmount(() => window.removeEventListener('keyup', keyListener))
    return {
      changeViewState,
      changeFontSize,
      showNextPanel,
      panel
    }
  },
  props: {bibleView: Object}
})
</script>
