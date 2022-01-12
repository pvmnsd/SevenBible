import {provide, ref} from "vue";

export default (id) => {
  const bibleTextKey = ref(0)
  const chosenVerse = ref(1);
  const bookFullName = ref(null)
  const bookShortName = ref(null)


  provide('id', id)
  provide("bibleTextKey", bibleTextKey)
  provide('chosenVerse', chosenVerse)
  provide('bookShortName', bookShortName)
  provide('bookFullName', bookFullName)

  return {
    bookFullName,
    bookShortName,
  }
}
