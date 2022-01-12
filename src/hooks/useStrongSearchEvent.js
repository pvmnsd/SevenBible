import {computed} from "vue";
import {useQuasar} from "quasar";

export default (id, store, props) => {
  const {notify} = useQuasar()

  const isStrong = computed(() =>
    props.info.strong_numbers === 'false' ? false : ('strong_numbers') in props.info
  )
  const onStrongSearch = (target) => {
    if (target.nextElementSibling?.tagName !== 'S' || !isStrong.value) {
      const message = !isStrong.value ? 'Для выбраного модуля отсутствует поддержка номеров стронга' :
        `Слово '${target.innerText}' не найдено в словаре стронга`
      notify({
        classes: 'not-found',
        type: 'info',
        position: 'bottom-right',
        timeout: 500,
        message,
      })
      return
    }
    let strongNumbers = []
    while (target.nextElementSibling?.tagName === 'S') {
      target = target.nextElementSibling
      strongNumbers.push(props.strongNumbersPrefix + target.innerText)
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
