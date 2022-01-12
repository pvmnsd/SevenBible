import {provide, reactive} from "vue";

export default () => {
  const transitions = reactive({
    bookSelector: false,
    bookSearcher: false,
    strongSearcher: false,
    crossreferencesSearcher: false,
    translationsComparator: false,
    subheadingsSettings: false,
    commentariesSettings: false,
  })
  provide('transitions', transitions)

  return {
    transitions
  }
}
