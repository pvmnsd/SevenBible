export const strongSearch = (id, element, isStrong, strongNumbersPrefix, notify, changeModuleState) => {
  if (element.nextElementSibling?.tagName !== 'S' || !isStrong) {
    const message = !isStrong ? 'Для выбраного модуля отсутствует поддержка номеров стронга' :
      `Слово '${element.innerText}' не найдено в словаре стронга`
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
  while (element.nextElementSibling?.tagName === 'S'){
    element = element.nextElementSibling
    strongNumbers.push(strongNumbersPrefix + element.innerText)
  }
  changeModuleState({
    key: 'strong',
    id,
    settings: {
      show: true,
      strongNumbers
    },
  })
}
export const getCommentByFootnote = (element, popupProxyTarget, popupProxyText, popupProxy, footnotes) => {
  popupProxyTarget.value = element
  popupProxyText.value = footnotes[element.outerText]
  popupProxy.value.toggle()
}
