import {ref, h, Ref, VNode} from "vue";
import RefSelector from "components/Main/popupWindows/RefSelector.vue";
import TextSearcher from "components/Main/popupWindows/textSearcher.vue";
import TranslationsComparator from 'components/Main/popupWindows/TranslationsComparator.vue'
import CommentariesSettings from "components/Main/popupWindows/commentariesSettings.vue";
import SubheadingsSettings from "components/Main/popupWindows/subheadingsSettings.vue";
import StrongSearcher from "components/Main/popupWindows/strongSearcher.vue";
import BookmarkCreator from "components/Main/popupWindows/BookmarkCreator.vue";
import CrossreferencesSearcher from "components/Main/popupWindows/crossreferencesSearcher.vue";
import CommentariesComparator from "components/Main/popupWindows/CommentariesComparator.vue";

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
