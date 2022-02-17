import {RemoveBookmarkArgs} from "app/types/api-args/systemArgs";
import getBookmarkCategories from "src-electron/api/system/api/getBookmarkCategories";
import fs from "fs-extra";
import path from "path";

export default (args: RemoveBookmarkArgs) => {
  const categories = getBookmarkCategories()
  categories[args.categoryIndex].bookmarks.splice(args.bookmarkIndex, 1)
  fs.writeJSONSync(path.join(dir, 'user', 'bookmarks', 'bookmarks.mbb.json'), {categories})
}
