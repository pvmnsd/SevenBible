import {onBeforeUnmount} from "vue";

export const useStrongDatabaseConnection = (filename) => {
  window.api.strong.connectDatabase(filename.value)
  onBeforeUnmount(() => window.api.strong.disconnectDatabase(filename.value))
}

export const useBibleDatabaseConnection = (filename) => {
  window.api.bible.connectDatabase(filename.value)
  onBeforeUnmount(() => window.api.bible.disconnectDatabase(filename.value))
}

export const useCommentariesDatabaseConnection = (filename) => {
  window.api.commentaries.connectDatabase(filename.value)
  onBeforeUnmount(() => window.api.commentaries.disconnectDatabase(filename.value))
}
