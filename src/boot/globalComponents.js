import {boot} from 'quasar/wrappers'
import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
export default boot(({app}) => {
  app.component('DynamicScroller', DynamicScroller)
  app.component('DynamicScrollerItem', DynamicScrollerItem)
})
