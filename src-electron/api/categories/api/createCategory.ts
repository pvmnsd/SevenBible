import {CreateCategoryArgs} from "app/types/api-args/categories";
import {getBookmarkCategories, writeBookmarkCategories} from "src-electron/api/categories/api/categoriesFS";

export default (args: CreateCategoryArgs) => {
  const categories = getBookmarkCategories('bookmarks')
  categories.push(args.category)
  writeBookmarkCategories(args.filename, categories)

}
