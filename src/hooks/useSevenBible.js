import {inject} from "vue";

export default () => {
  return{
    get id(){
      return inject('id')
    },
    get transitions(){
      return inject('transitions')
    },
    get chosenVerse(){
      return inject('chosenVerse')
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
    }
  }
}
