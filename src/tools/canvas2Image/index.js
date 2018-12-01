import { Canvas2Image } from '../../libs/canvasDraw/canvasUtil'


const plugin = {
  install (Vue) {
    if (!Vue.Canvas2Image) {
      Vue.Canvas2Image = Canvas2Image
    } else {
      Vue.$Canvas2Image = Canvas2Image
    }

    Vue.mixin({
      created: function () {
        if (!this.Canvas2Image) {
          this.Canvas2Image = Canvas2Image
        } else {
          this.$Canvas2Image = Canvas2Image
        }
      }
    })
  }
}

export default plugin
export const install = plugin.install
