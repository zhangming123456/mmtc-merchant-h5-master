// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  'plugins': {
    // 编辑目标浏览器：使用package.json中的“browserslist”字段
    'postcss-import': {},
    'postcss-url': {},
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {utf8: false},
    // "postcss-cssnext": {},
    'postcss-px-to-viewport': {
      viewportWidth: 7500,// 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 13340, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 5,// 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'rem',// 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['.navBar', '.van-tabs__wrap--content-bottom', '.maxWidth500', 'azm-fixed__maxW'],// 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
    },
    'postcss-viewport-units': {},
    'cssnano': {
      'preset': 'default',
      'autoprefixer': false,
      'postcss-zindex': false
    },
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    // 'postcss-pxtorem': {
    //   rootValue: 75,
    //   propList: ['*']
    // }
  }
}
