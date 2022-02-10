import {boot} from 'quasar/wrappers'

export default boot(({app}) => {
  app.directive('focus', {
    mounted: (el) => {
      setTimeout(() => {
        el.tabIndex = 0
        el.focus()
      })
    }
  })
})

