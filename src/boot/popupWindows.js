import {ref, h} from "vue";

const isPopupShown = ref(true)
const component = ref(null)

const showPopup = (Component, _props = {}) => {
  return new Promise(resolve => {
    const vNode = h(Component, {..._props})

    vNode.props.onClose = (response) => {
      resolve(response)
      isPopupShown.value = false
    }

    component.value = vNode
    isPopupShown.value = true
  })
}

import RefSelector from "components/bible/transitions/RefSelector";
import TextSearcher from "components/bible/transitions/textSearcher";
import TranslationsComparator from "components/bible/transitions/translationsComparator";
import CommentariesSettings from "components/bible/transitions/commentariesSettings";
import SubheadingsSettings from "components/bible/transitions/subheadingsSettings";
import StrongSearcher from "components/bible/transitions/strongSearcher";
import BookmarkCreator from "components/bible/transitions/BookmarkCreator";
import CrossreferencesSearcher from "components/bible/transitions/crossreferencesSearcher";

export const usePopupWindows = () => {
  return {
    get isPopupShown() {
      return isPopupShown
    },
    get component() {
      return component
    },
    showRefSelector: (props) => showPopup(RefSelector, props),
    showTextSearcher: (props) => showPopup(TextSearcher, props),
    showTranslationsComparator: (props) => showPopup(TranslationsComparator, props),
    showCommentariesSettings: (props) => showPopup(CommentariesSettings, props),
    showSubheadingsSettings: (props) => showPopup(SubheadingsSettings, props),
    showStrongSearcher: (props) => showPopup(StrongSearcher, props),
    showBookmarkCreator: (props) => showPopup(BookmarkCreator, props),
    showCrossreferencesSearcher: (props) => showPopup(CrossreferencesSearcher, props)

  }
}
