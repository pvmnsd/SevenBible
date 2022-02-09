import {boot} from 'quasar/wrappers'

export default boot(({app}) => {
  app.directive('focus', {
    mounted: (el) => {
      el.tabIndex = 0
      el.focus()
    }
  })
})

