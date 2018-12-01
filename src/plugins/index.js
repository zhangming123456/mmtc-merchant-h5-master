import config from '../libs/config'
import store from '../vuex'
import router from '../router'
import Vue from 'vue'

import {
  LocalePlugin,
  DatetimePlugin,
  CloseDialogsPlugin,
  ConfigPlugin,
  BusPlugin,
  DevicePlugin,
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin,
  AppPlugin,
  TransferDom
  // debounce,
  // throttle
} from 'vux'

// throttle(func, [wait = 0], [options = {}])
// debounce(func, [wait = 0], [options = {}])
// vant-插件
import { ImagePreview, Lazyload } from 'vant'
import 'vant/lib/vant-css/index.css'

// muse-ui插件
import 'muse-ui/lib/styles/base.less'
import 'muse-ui/lib/styles/theme.less'
import 'muse-ui-message/dist/muse-ui-message.css'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import 'muse-ui-progress/dist/muse-ui-progress.css'
// import 'muse-ui/dist/muse-ui.css';
import Message from 'muse-ui-message'
import Toast from 'muse-ui-toast'
import Loading from 'muse-ui-loading'
import NProgress from 'muse-ui-progress'
import {
  Form,
  TextField,
  Icon,
  Grid,
  GridList,
  Helpers,
  List,
  Tabs,
  Button,
  Dialog,
  Snackbar,
  Drawer,
  Progress
} from 'muse-ui'


// 引用roboto字体
// import 'typeface-roboto'

// VUX-plugins
Vue.directive('transfer-dom', TransferDom)
Vue.use(CloseDialogsPlugin, router)
Vue.use(LocalePlugin)
Vue.use(DatetimePlugin)
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX'// global config for VUX, since v2.5.12
})
Vue.use(DevicePlugin)
Vue.use(ToastPlugin, {width: '122px'})
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(BusPlugin)
Vue.use(Form)

if (process.env.platform === 'app') {
  Vue.use(AppPlugin, store)
}

// vant-plugins
Vue.use(ImagePreview)
Vue.use(Lazyload, {
  loading: `https://app.mmtcapp.com/mmtch5/images/imageLoading.png?${config.version}`,
  error: `https://app.mmtcapp.com/mmtch5/images/imageErr.png?${config.version}`,
})

// vant-method
Vue.prototype.$vant = {
  ImagePreview
}

// muse-plugins
Vue.use(TextField)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridList)
Vue.use(Helpers)
Vue.use(List)
Vue.use(Tabs)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Snackbar)
Vue.use(Drawer)
Vue.use(Progress)
Vue.use(Message)
Vue.use(Loading)
Vue.use(Toast, {
  position: 'top-start',               // 弹出的位置
  time: 2000,                       // 显示的时长
  closeIcon: 'close',               // 关闭的图标
  close: true,                      // 是否显示关闭按钮
  successIcon: 'check_circle',      // 成功信息图标
  infoIcon: 'info',                 // 信息信息图标
  warningIcon: 'priority_high',     // 提醒信息图标
  errorIcon: 'warning'              // 错误信息图标
})
Vue.use(NProgress, {
  zIndex: 2000,          // progress z-index
  top: 0,                // position fixed top
  speed: 300,            // progress speed
  color: 'primary',      // color
  size: 2,               // progress size
  className: ''          // progress custom class
})


Vue.$muse = {
  toast: Toast,
  loading: Loading,
  message: Message
}

import Navigation from 'vue-navigation'

Vue.use(Navigation, {router, store});
// import TouchRipple from 'vue-touch-ripple'
// import VueScrollTo from 'vue-scrollto'
// import VueScroll from 'vue-scroll'
// import VueScroller from 'vue-scroller'

// Vue.use(TouchRipple)
// Vue.use(VueScrollTo)
// Vue.use(VueScroll)
// Vue.use(VueScroller)

import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);

import 'cropperjs/dist/cropper.min.css'

export default {}
