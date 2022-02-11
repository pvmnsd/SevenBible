import {provide, ref, watch, Ref} from "vue";
import useBibleModuleTables from "src/hooks/useBibleModuleTables";
import {myRef} from "src/helpers";
import {BibleBooks, BibleInfo} from "src-electron/types/bible";
import {MyRef} from "src/types/myRef";

export default (bibleFileName: Ref<string>) => {
  let info = ref<BibleInfo>()
  let booksList: MyRef<BibleBooks> = myRef(null)
  provide('booksList', booksList)

  const getBibleModuleInfo = async () => {
    const tables = await useBibleModuleTables(bibleFileName.value)
    if (!tables.info || !tables.booksList) return
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
