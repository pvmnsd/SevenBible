<template>
  <UIButtonDropdown :icon='Icons.Dots'>
    <div>
      <div v-if="panel === 'show'">
        <div class="q-py-sm q-px-md no-selectable column">
          <div class="row content-between no-wrap q-gutter-x-sm">
            <q-btn
              :icon="Icons.PrevChapter"
              round
              unelevated
              @click="showPrevPanel('show')"
            />
            <span class="text-center text-h6 col">Показывать</span>
            <q-btn
              :icon="Icons.NextChapter"
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
            <q-space/>
            <q-btn
              round
              flat
              size="xs"
              :icon="Icons.Settings"
              @click="popup.showSubheadingsSettings"
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
              round
              flat
              size="xs"
              :icon="Icons.Settings"
              @click="popup.showCommentariesSettings"
            />
          </div>
          <q-checkbox
            @update:model-value="changeViewState('showVerseNumber', $event)"
            :model-value="bibleView.showVerseNumber"
            label="нумерацию стихов"
          />
          <q-separator/>

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
          <q-separator/>
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
          <q-separator class="q-my-sm"/>
          <div class="flex justify-center">
            <div>
              <q-btn
                disable
                :icon="Icons.Plus"
                @click="changeFontSize('+')"
              />
              <q-btn
                disable
                @click="changeFontSize('-')"
                :icon="Icons.Minus"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="panel === 'open'">
        <div class="q-py-sm q-px-md q-gutter-y-sm no-selectable column">
          <div class="row content-between">
            <q-btn
              :icon="Icons.PrevChapter"
              round
              unelevated
              @click="showPrevPanel('open')"
            />
            <span class="text-center text-h6 col">Открыть</span>
            <q-btn
              :icon="Icons.NextChapter"
              round
              unelevated
              @click="showNextPanel('open')"
            />
          </div>

          <q-btn
            label="Словарь стронга"
            :icon-right="Icons.Strong"
            align="between"
            @click="changeState('strong.show')"
          />
          <q-btn
            label="Словарь"
            :icon-right="Icons.Dictionary"
            align="between"
            @click="changeState('dictionary.show')"
          />
          <q-btn
            label="Комментарии"
            :icon-right="Icons.Commentaries"
            align="between"
            @click="changeState('commentaries.show')"
          />
        </div>
      </div>
    </div>
  </UIButtonDropdown>
</template>

<script setup lang="ts">
import useStore from "src/hooks/useStore";
import {ref} from "vue"
import useSevenBible from "src/hooks/useSevenBible";
import UIButtonDropdown from "components/UI/UIButtonDropdown.vue";
import {Icons} from "src/types/icons";

const {id, bible, popup} = useSevenBible()

const panels = ['show', 'open']
const panel = ref('open')

const showNextPanel = (current: string) => {
  const index = panels.indexOf(current)
  panel.value = panels.length > index + 1 ? panels[index + 1] : panels[0]
}
const showPrevPanel = (current: string) => {
  const index = panels.indexOf(current)
  panel.value = index - 1 !== -1 ? panels[index - 1] : panels[panels.length - 1]
}

const store = useStore()

const changeViewState = (key: string, value: any) => {
  store.state.set(`workPlace.${id}.bible.view.${key}`, value)
}
const changeState = (key: string, value?: any) => {
  store.state.set(`workPlace.${id}.${key}`, value)
}
const bibleView = bible.value.view

</script>
