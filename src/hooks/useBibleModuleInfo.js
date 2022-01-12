import {ref} from "vue";
import useBibleModuleTables from "src/hooks/useBibleModuleTables";

export default (bookFileName) => {
  let info = ref({})

  const getBibleModuleInfo = async () => {
    const tables = await useBibleModuleTables(bookFileName.value)
    info.value = tables.info
  }
  info.value = getBibleModuleInfo(bookFileName.value)

  return {
    info,
    getBibleModuleInfo
  }
}
