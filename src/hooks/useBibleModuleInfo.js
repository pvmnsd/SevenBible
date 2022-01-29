import { provide, ref, watch} from "vue";
import useBibleModuleTables from "src/hooks/useBibleModuleTables";
import {myRef} from "src/helpers";

export default (bibleFileName) => {
  let info = ref({})
  let booksList = myRef(null)
  provide('booksList', booksList)

  const getBibleModuleInfo = async () => {
    const tables = await useBibleModuleTables(bibleFileName.value)
    info.value = tables.info
    booksList.value = tables.booksList
  }
  info.value = getBibleModuleInfo(bibleFileName.value)
  watch(bibleFileName, () => getBibleModuleInfo())
  return {
    info
  }
}
