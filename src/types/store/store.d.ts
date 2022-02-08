import {WorkPlace} from "src/types/store/workPlace";
import {App} from "src/types/store/app";

export interface Store {
  app: App,
  workPlace: WorkPlace[]
}
