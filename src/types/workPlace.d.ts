import {Bible} from "src/types/bible";
import {Strong} from "src/types/strong";
import {Commentaries} from "src/types/commentaries";

export interface WorkPlace {
  active: boolean,
  bible: Bible,
  strong: Strong,
  commentaries: Commentaries,
}
