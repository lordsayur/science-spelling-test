const path = require("path");

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'src'),
        "@components": path.resolve(__dirname, 'src/components'),
        "@composables": path.resolve(__dirname, 'src/composables'),
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
};