import {DeleteCategoryArgs} from "app/types/api-args/categories";
import {getBookmarkCategories, writeBookmarkCategories} from "src-electron/api/categories/api/categoriesFS";

export default (args: DeleteCategoryArgs) => {
  const categories = getBookmarkCategories(args.filename)
  const index = categories.findIndex(category => category.name === args.categoryName)
  categories.splice(index, 1)
  writeBookmarkCategories(args.filename, categories)
}
