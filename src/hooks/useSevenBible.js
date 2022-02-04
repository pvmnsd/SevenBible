import {inject} from "vue";

export default () => {
  return{
    get id(){
      return inject('id')
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
      return inject('bible')
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
      return inject('popup')
    },
  }
}
