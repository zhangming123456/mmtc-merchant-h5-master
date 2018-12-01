import Previewer from 'vux/src/components/previewer'
import { mergeOptions } from "vux/src/libs/plugin_helper"

const objectAssign = Object.assign;
let $vm
let watcher

const plugin = {
  install (vue, pluginOptions = {}) {
    const Previewer = vue.extend(Previewer);

    if (!$vm) {
      $vm = new Previewer({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    const defaults = {}
    for (let i in $vm.$options.props) {
      if (i !== 'value') {
        defaults[i] = $vm.$options.props[i].default
      }
    }

    const previewer = {
      show (options = {}) {
        // destroy watcher
        watcher && watcher()
        if (typeof options === 'string') {
          mergeOptions($vm, objectAssign({}, pluginOptions, {list: [{src: options}]}))
        } else if (typeof options === 'object') {
          mergeOptions($vm, objectAssign({}, pluginOptions, options))
        }
        if (typeof options === 'object') {
          watcher = $vm.$watch('list', (val) => {

          })
        }
        $vm.show(0)
      }
    }

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {previewer}
    } else {
      vue.$vux.previewer = previewer
    }

    vue.mixin({
      created: function () {
        this.$vux = vue.$vux
      }
    })
  }
}

export default plugin
export const install = plugin.install

