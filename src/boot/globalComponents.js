import {boot} from 'quasar/wrappers'
import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller'
export default boot(({app}) => {
  app.component('DynamicScroller', DynamicScroller)
  app.component('DynamicScrollerItem', DynamicScrollerItem)
})
