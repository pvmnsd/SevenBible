import {ref} from "vue";
import useSevenBible from "src/hooks/useSevenBible";
import {BookmarkCategory} from "app/types/bookmark";

interface Options {
  getPreparedCategories: () => Promise<void>
}
export default (options:Options ) => {
  const {bookmarks} = useSevenBible()
  const showCategoryCreator = ref(false)

  const categoryName = ref<string>()
  const categoryColor = ref<string>()

  const openCategoryCreator = () => {
    showCategoryCreator.value = true
  }
  const createCategory = async () => {
    const newCategory: BookmarkCategory = {
        bookmarks: [],
        colorIndex: 0,
        name: categoryName.value!,
        backgroundColor: categoryColor.value,
        backgroundHighlighting: false,
        isDefault: false,
        quickBookmarkAdding: false
    }
    await bookmarks.createCategory(newCategory)
    await options.getPreparedCategories()
    showCategoryCreator.value = false
  }
  return {
    categoryName,
    categoryColor,
    showCategoryCreator,
    openCategoryCreator,
    createCategory
  }
}
