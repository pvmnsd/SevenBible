import {computed} from "vue";
import useSevenBible from "src/hooks/useSevenBible";
import {notify} from "src/wrappers/notify";

export default (id, store, strongNumbersPrefix) => {
  const {bibleModuleInfo: info} = useSevenBible()

  const isStrong = computed(() =>
    info.value.strong_numbers === 'false' ? false : ('strong_numbers') in info.value
  )
  const onStrongSearch = (target) => {
    if (target.nextElementSibling?.tagName !== 'S' || !isStrong.value) {
      const message = !isStrong.value ? 'Для выбраного модуля отсутствует поддержка номеров стронга' :
        `Слово '${target.innerText}' не найдено в словаре стронга`
      notify.showWarning(message)
      return
    }
    let strongNumbers = []
    while (target.nextElementSibling?.tagName === 'S') {
      target = target.nextElementSibling
      strongNumbers.push(strongNumbersPrefix.value + target.innerText)
    }
    store.state.set(`workPlace.${id}.strong`, {
      show: true,
      strongNumbers
    })
  }

  return {
    onStrongSearch
  }
}
