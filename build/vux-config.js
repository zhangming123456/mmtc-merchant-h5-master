'use strict'

const path = require('path')
const fs = require('fs')
const demoPath = path.resolve(__dirname, '../src/router/routes.json')
const glob = require('glob')

const argv = require('yargs').argv
argv.simulate = argv.simulate || false

function toDash (str) {
  return str.replace(/([A-Z])/g, function (m, w) {
    return '-' + w.toLowerCase()
  }).replace('-', '')
}

function isArray (object) {
  return object && typeof object === 'object' &&
    typeof object.length === 'number' &&
    typeof object.splice === 'function' &&
    //判断length属性是否是可枚举的 对于数组 将得到false
    !(object.propertyIsEnumerable('length'))
}

function isObject (obj) {
  return !!obj && obj !== null && typeof obj === 'object' && isArray(obj) === false
}

function getRouter (item, children) {
  let path, filename, file_path, bol = false, meta = item.meta || {}

  if (item.title) {
    meta.title = item.title
  }
  meta = JSON.stringify(meta)
  // for (let k in meta) {
  //   metaStr += `${k}=${meta[k]},`
  // }
  // metaStr.replace(/,$/, '')
  // if (!metaStr) {
  //   metaStr = '{}'
  // }
  if (typeof children === 'boolean' && children === true) {
    bol = true
  }
  if (typeof item === 'string') {
    if (/^\//.test(item)) {
      item = item.replace(/^\//, '')
    }
    file_path = item
    filename = item.replace(/\//ig, '_')
  } else if (isObject(item)) {
    if (/^\//.test(item.path)) {
      item.path = item.path.replace(/^\//, '')
    }
    file_path = item.path
    if (item.file_path) {
      file_path = item.file_path
    }
    filename = item.path.replace(/\//ig, '_')
    if (item.children) {
      children = item.children
    }
  }
  path = `/${toDash(filename)}`
  if (bol) {
    path = `${toDash(filename)}`
  }
  if (isArray(children)) {
    let arr = []
    for (let v  of children) {
      arr.push(getRouter(v, true))
    }
    console.log(arr, 'array')
    arr = `[${arr.join(',\n')}]`
    return `{path: '${path}',name:'${filename}',component: () => import('../page/${file_path}.vue').then(m => m.default),children:${arr},meta: ${meta},props: (route) => ({ query: route.query })}`
  } else {
    return `{path: '${path}',name:'${filename}',component: () => import('../page/${file_path}.vue').then(m => m.default),meta: ${meta},props: (route) => ({ query: route.query })}`
  }
}

module.exports = {
  plugins: [
    'vux-ui',
    'progress-bar',
    {
      name: 'duplicate-style',
      options: {
        cssProcessorOptions: {
          safe: true,
          zindex: false,
          autoprefixer: {
            add: true,
            'browsers': [
              'iOS >= 7',
              'Android >= 4.1'
            ]
          }
        }
      }
    },
    {
      name: 'less-theme',
      path: 'src/styles/theme.less'
    }
  ]
}

// {
//   name: 'js-parser',
//   // path: 'src/router',
//   test: /router/,
//   fn: function (source) {
//     this.addDependency(demoPath)
//     let list = fs.readFileSync(demoPath, 'utf-8')
//     list = JSON.parse(list)
//     if (argv.demo) {
//       list = list.filter(item => {
//         return item.indexOf(argv.demo) > -1
//       })
//     }
//     let str = []
//     list.forEach(item => {
//       str.push(getRouter(item))
//     })
//     str.push(`{path: '*',component: () => import('../view-render/40x.vue').then(m => m.default)}`)
//
//     str = `[${str.join(',\n')}]`
//     source = source.replace('let routes = []', 'let routes = ' + str)
//     console.log(`
//     +++++++++start++++++++++
//     ${source}+++++++++end++++++++++
//     `)
//     return source
//   }
// },
