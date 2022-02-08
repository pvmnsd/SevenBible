import {provide, ref, watch, Ref} from "vue";
import useBibleModuleTables from "src/hooks/useBibleModuleTables";
import {myRef} from "src/helpers";
import {BibleBooks, BibleInfo} from "src-electron/types/bible";
import {MyRef} from "src/types/myRef";

export default (bibleFileName: Ref<string>) => {
  let info: Ref<BibleInfo> = ref({})
  let booksList: MyRef<BibleBooks> = myRef(null)
  provide('booksList', booksList)

  const getBibleModuleInfo = async () => {
    const tables = await useBibleModuleTables(bibleFileName.value)
    info.value = tables.info
    booksList.value = tables.booksList
  }
  getBibleModuleInfo()

  watch(bibleFileName, (newFilename, oldFilename) => {
    window.api.bible.disconnectDatabase(oldFilename)
    window.api.bible.connectDatabase(newFilename)
    getBibleModuleInfo()
  })
  return {
    info
  }
}
