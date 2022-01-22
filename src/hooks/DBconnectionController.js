import {onBeforeUnmount} from "vue";

export const useStrongDatabaseConnection = (filename) => {
  window.strong.connectDatabase(filename.value)
  onBeforeUnmount(() => window.strong.disconnectDatabase(filename.value))
}

export const useBibleDatabaseConnection = (filename) => {
  window.bible.connectDatabase(filename.value)
  onBeforeUnmount(() => window.bible.disconnectDatabase(filename.value))
}

export const useCommentariesDatabaseConnection = (filename) => {
  window.commentaries.connectDatabase(filename.value)
  onBeforeUnmount(() => window.commentaries.disconnectDatabase(filename.value))
}
