<template>
  <UIWorkPlaceWindow>

    <UIWorkPlaceWindowHeader>
      <CommentariesTopBar
        :commentaries-file-name="commentariesModule.fileName"
        :book-short-name="bookShortName"
        :chapter-number="chapterNumber"
      />
    </UIWorkPlaceWindowHeader>

    <UIWorkPlaceWindowBody>
      <template v-if="!showLoader">
        <div
          class="text-center"
          v-if="!commentaries.length"
          v-text='`В модуле "${commentariesModule.fileName}" не найдено комментариев на выбраную главу.`'
        />
        <div
          v-else
          v-for="(item, id) in commentaries"
          :key="id"
          :items="commentaries"
        >
          <div>
            <a
              class="text-weight-bold"
              v-text="bookShortName + ' ' + item.chapter + ':' + item.verseNumber"
            />
          </div>
          <span v-html="item.text"/>
        </div>
      </template>

      <q-inner-loading v-else :showing="showLoader">
        <q-spinner-gears size="50px"/>
      </q-inner-loading>
    </UIWorkPlaceWindowBody>

  </UIWorkPlaceWindow>
</template>

<script>
import CommentariesTopBar from "components/bible/splitter/commentaries/commentariesTopBar"
import {onMounted, watch} from "vue"
import useStore from "src/hooks/useStore";
import UIWorkPlaceWindow from "components/UI/WorkPlaceWindow/UIWorkPlaceWindow";
import UIWorkPlaceWindowHeader from "components/UI/WorkPlaceWindow/UIWorkPlaceWindowHeader";
import UIWorkPlaceWindowBody from "components/UI/WorkPlaceWindow/UIWorkPlaceWindowBody";
import useSevenBible from "src/hooks/useSevenBible";
import useCommentaries from "src/hooks/useCommentaries";

export default {
  setup(props) {
    const {id, bookShortName} = useSevenBible()
    const store = useStore()
    const commentariesModule = store.state.getReactive(`workPlace.${id}.commentaries`)
    const chapterNumber = store.state.getReactive(`workPlace.${id}.bible.chapterNumber`)

    const {commentaries, showLoader, getCommentaries} = useCommentaries(id, store, commentariesModule)

    watch([
      () => props.refString,
      () => commentariesModule.value.fileName
    ], () => {
      getCommentaries()
    })
    onMounted(() => getCommentaries())

    return {
      commentaries,
      showLoader,
      commentariesModule,
      bookShortName,
      chapterNumber
    }
  },
  props: {
    refString: String
  },
  components: {
    UIWorkPlaceWindowBody,
    UIWorkPlaceWindowHeader,
    UIWorkPlaceWindow,
    CommentariesTopBar
  }
}
</script>
