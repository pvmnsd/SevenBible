import useBibleApi from "src-electron/api/bible/useBibleApi";
import useCommentariesApi from "src-electron/api/commentaries/useCommentariesApi";
import useStrongApi from "src-electron/api/strong/useStrongApi";
import useElectronApi from "src-electron/api/electron/useElectronApi";
import useSystemApi from "src-electron/api/system/useSystemApi";
import useCrossreferences from "src-electron/api/crossreferences/useCrossreferences";

export default () => {
  useBibleApi()
  useCommentariesApi()
  useStrongApi()
  useCrossreferences()
  useElectronApi()
  useSystemApi()
}
