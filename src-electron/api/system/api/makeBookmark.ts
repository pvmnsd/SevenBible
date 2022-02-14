import {MakeBookmarkArgs} from "app/types/api-args/makeBookmarkArgs";
import fs from "fs-extra";
import path from "path";
import {BookmarkCategory} from "app/types/bookmark";

export default (args: MakeBookmarkArgs) => {
  const filename = 'bookmarks.mbb.json'
  const _path = path.join(dir, 'user', 'bookmarks', filename)
  const categories: BookmarkCategory[] = fs.readJSONSync(_path).categories
  let categoryIndex = categories.findIndex(category => category.name === args.categoryName)
  categories[categoryIndex].bookmarks.push(args.bookmark)
  fs.writeJSONSync(_path, {categories})
  return
}
