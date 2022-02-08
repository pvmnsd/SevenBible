import {Bible} from "src/types/store/bible";
import {Strong} from "src/types/store/strong";
import {Commentaries} from "src/types/store/commentaries";

export interface WorkPlace {
  active: boolean,
  bible: Bible,
  strong: Strong,
  commentaries: Commentaries,
}
