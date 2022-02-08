import {inject} from "vue";
import {bible_, id_, popup_} from "src/symbols";
import {injectStrict} from "src/helpers";

export default () => {
  return{
    get id(){
      return injectStrict(id_)
    },
    get bibleTextKey(){
      return inject('bibleTextKey')
    },
    get activeWorkPlaces(){
      return inject('activeWorkPlaces')
    },
    get bookFullName(){
      return inject('bookFullName')
    },
    get bookShortName(){
      return inject('bookShortName')
    },
    get bible(){
      return injectStrict(bible_)
    },
    get bibleModuleInfo(){
      return inject('bibleModuleInfo')
    },
    get activeWorkPlaceWindows(){
      return inject('activeWorkPlaceWindows')
    },
    get allModulesClosed(){
      return inject('allModulesClosed')
    },
    get viewParamsRequiringRerender(){
      return inject('viewParamsRequiringRerender')
    },
    get textDirections(){
      return inject('textDirections')
    },
    get refString(){
      return inject('refString')
    },
    get strongNumbersPrefix(){
      return inject('strongNumbersPrefix')
    },
    get booksList(){
      return inject('booksList')
    },
    get popup(){
      return injectStrict(popup_)
    },
  }
}
