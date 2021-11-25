<template>
    <CommentariesTopBar
      :commentaries-file-name="commentariesFileName"
      :book-short-name="bookShortName"
      :chapter-number="chapterNumber"
    />
    <div class="relative-position column col">
      <q-scroll-area
        class="col"
        id="scroll-target"
      >
        <div
          class="q-px-xl q-py-sm text-center"
          v-if="!commentaries.length && !showLoader"
          v-text='`В модуле "${commentariesFileName}" не найдено комментариев на выбраную главу.`'
        />
        <q-virtual-scroll
          v-else
          scroll-target="#scroll-target > .scroll"
          :items="commentaries"
          virtual-scroll-slice-size="1"
          virtual-scroll-slice-ratio-before="0.3"
          class="q-px-xl q-py-sm q-gutter-sm"
        >
          <template v-slot="{ item }">
            <div>
              <a
                class="text-weight-bold"
                v-text="bookShortName + ' ' + chapterNumber + ':' + item.verseNumber"
              />
            </div>
            <span v-html="item.text"/>
          </template>
        </q-virtual-scroll>

      </q-scroll-area>

      <q-inner-loading :showing="showLoader">
        <q-spinner-gears size="50px" color="primary"/>
      </q-inner-loading>
    </div>

</template>

<script>
import CommentariesTopBar from "components/bible/splitter/commentaries/commentariesTopBar"
import {onMounted, ref, watch, nextTick} from "vue"

export default {
  setup(props) {
    const commentaries = ref([])
    const showLoader = ref(false)

    const getCommentaries = async () => {
      showLoader.value = true
      commentaries.value = []
      const settings = {
        chapterNumber: props.chapterNumber,
        bookNumber: props.bookNumber,
        commentaryFileName: props.commentariesFileName
      }
      commentaries.value = await window.electron.invoke('get-commentaries', settings)
      showLoader.value = false
    }
    watch([() => props.chapterNumber, () => props.bookNumber, () => props.commentariesFileName], (chapterNumber) => {
      getCommentaries()
    })
    onMounted(() => getCommentaries())

    return {commentaries, showLoader}
  },
  props: {
    bookFileName: String,
    chapterNumber: Number,
    commentariesFileName: String,
    bookNumber: Number,
    bookShortName: String
  },
  components: {CommentariesTopBar}
}
</script>
