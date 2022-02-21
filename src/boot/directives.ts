import {boot} from 'quasar/wrappers'

export default boot(({app}) => {
  app.directive('focus', {
    mounted: (el, binding) => {
      setTimeout(() => {
        el.tabIndex = 0
        el.focus()
      }, binding.modifiers.next ? 300 : 0)
    }
  })
})

