// vue.config.js
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// var pageNames = ['custom', 'origin']
// var entry = {}
// var plugins = []
// pageNames.map(pageName => {
//   entry[pageName] = `./src/applications/${pageName}.js`
//   plugins.push(new HtmlWebpackPlugin({
//     filename: pageName + '.html',
//     template: `./public/${pageName}.html`, //模板路径
//     inject: true,
//     excludeChunks: pageNames.filter(item => item != pageName)
//   }))
// })

module.exports = {
  assetsDir: 'assets',
  baseUrl: './',
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html'
    },
    custom: {
      // entry for the page
      entry: 'src/custom.js',
      // the source template
      template: 'public/custom.html',
      // output as dist/index.html
      filename: 'custom.html'
    },
    origin: {
      // entry for the page
      entry: 'src/origin.js',
      // the source template
      template: 'public/origin.html',
      // output as dist/index.html
      filename: 'origin.html'
    }
  }
}
