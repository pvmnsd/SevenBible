import {inject, Ref} from "vue";
import {
  bible_,
  bibleModuleInfo_,
  bibleWindowsUpdates_,
  bookFullName_,
  bookmarks_,
  bookShortName_,
  id_,
  popup_, updateBibleWindows_
} from "src/symbols";
import {injectStrict} from "src/helpers";

export default () => {
  return {
    get id() {
      return injectStrict(id_)
    },
    get bibleTextKey() {
      return inject('bibleTextKey')
    },
    get activeWorkPlaces() {
      return inject('activeWorkPlaces')
    },
    get bookFullName() {
      return injectStrict(bookFullName_)
    },
    get bookShortName() {
      return injectStrict(bookShortName_)
    },
    get bible() {
      return injectStrict(bible_)
    },
    get bibleModuleInfo() {
      return injectStrict(bibleModuleInfo_)
    },
    get activeWorkPlaceWindows() {
      return inject('activeWorkPlaceWindows')
    },
    get allModulesClosed() {
      return inject('allModulesClosed')
    },
    get viewParamsRequiringRerender() {
      return inject('viewParamsRequiringRerender')
    },
    get textDirections() {
      return inject('textDirections')
    },
    get refString() {
      return inject('refString')
    },
    get strongNumbersPrefix() {
      return inject('strongNumbersPrefix')
    },
    get booksList() {
      return inject('booksList')
    },
    get popup() {
      return injectStrict(popup_)
    },
    get bookmarks() {
      return injectStrict(bookmarks_)
    },
    get bibleWindowsUpdates() {
      return injectStrict(bibleWindowsUpdates_)
    },
    get updateBibleWindows() {
      return injectStrict(updateBibleWindows_)
    }
  }
}
