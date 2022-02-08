import {ref, h, Ref, VNode} from "vue";
import RefSelector from "components/bible/transitions/RefSelector.vue";
import TextSearcher from "components/bible/transitions/textSearcher.vue";
import TranslationsComparator from 'components/bible/transitions/TranslationsComparator.vue'
import CommentariesSettings from "components/bible/transitions/commentariesSettings.vue";
import SubheadingsSettings from "components/bible/transitions/subheadingsSettings.vue";
import StrongSearcher from "components/bible/transitions/strongSearcher.vue";
import BookmarkCreator from "components/bible/transitions/BookmarkCreator.vue";
import CrossreferencesSearcher from "components/bible/transitions/crossreferencesSearcher.vue";
import CommentariesComparator from "components/bible/transitions/CommentariesComparator.vue";

export interface Popup {
  isPopupShown: Ref<boolean>,
  component: any,

  showRefSelector: () => Promise<any>,
  showTextSearcher: () => Promise<any>,
  showTranslationsComparator: (props: any) => Promise<any>,
  showCommentariesSettings: (props: any) => Promise<any>,
  showSubheadingsSettings: (props: any) => Promise<any>,
  showStrongSearcher: (props: any) => Promise<any>,
  showBookmarkCreator: (props: any) => Promise<any>,
  showCrossreferencesSearcher: (props: any) => Promise<any>,
  showCommentariesComparator: (props: any) => Promise<any>
}

export const initPopupWindows = () => {
  const isPopupShown = ref(true)
  const component: Ref<VNode | null> = ref(null)

  const showPopup = (Component: any, _props: any = {}) => {
    return new Promise(resolve => {
      const vNode = h(Component, {..._props})

      vNode.props!.onClose = (response: any) => {
        resolve(response)
        isPopupShown.value = false
      }

      component.value = vNode
      isPopupShown.value = true
    })
  }

  const popup: Popup = {
    get isPopupShown() {
      return isPopupShown
    },
    get component() {
      return component
    },
    showRefSelector: () => showPopup(RefSelector),
    showTextSearcher: () => showPopup(TextSearcher),
    showTranslationsComparator: (props) => showPopup(TranslationsComparator, props),
    showCommentariesSettings: (props) => showPopup(CommentariesSettings, props),
    showSubheadingsSettings: (props) => showPopup(SubheadingsSettings, props),
    showStrongSearcher: (props) => showPopup(StrongSearcher, props),
    showBookmarkCreator: (props) => showPopup(BookmarkCreator, props),
    showCrossreferencesSearcher: (props) => showPopup(CrossreferencesSearcher, props),
    showCommentariesComparator: (props) => showPopup(CommentariesComparator, props)
  }

  return {
    popup,
    component,
    isPopupShown
  }
}
