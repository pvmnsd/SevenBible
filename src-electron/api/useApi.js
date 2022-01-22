import useBibleApi from "src-e/api/bible/useBibleApi";
import useCommentariesApi from "src-e/api/commentaries/useCommentariesApi";
import useStrongApi from "src-e/api/strong/useStrongApi";
import useElectronApi from "src-e/api/electron/useElectronApi";
import useSystemApi from "src-e/api/system/useSystemApi";
import useCrossreferences from "src-e/api/crossreferences/useCrossreferences";

export default () => {
  useBibleApi()
  useCommentariesApi()
  useStrongApi()
  useCrossreferences()
  useElectronApi()
  useSystemApi()
}
