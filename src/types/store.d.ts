import {WorkPlace} from "src/types/workPlace";
import {App} from "src/types/app";

export interface Store {
  app: App,
  workPlace: WorkPlace[]
}
