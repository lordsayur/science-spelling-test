const path = require("path");

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'src'),
        "@components": path.resolve(__dirname, 'src/components'),
        "@composables": path.resolve(__dirname, 'src/composables'),
        "@enums": path.resolve(__dirname, 'src/enums'),
        "@assets": path.resolve(__dirname, 'src/assets'),
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
};