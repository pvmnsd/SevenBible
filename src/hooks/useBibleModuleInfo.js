import {ref, watch} from "vue";
import useBibleModuleTables from "src/hooks/useBibleModuleTables";

export default (bibleFileName) => {
  let info = ref({})

  const getBibleModuleInfo = async () => {
    const tables = await useBibleModuleTables(bibleFileName.value)
    info.value = tables.info
  }
  info.value = getBibleModuleInfo(bibleFileName.value)
  watch(bibleFileName, () => getBibleModuleInfo())
  return {
    info
  }
}
