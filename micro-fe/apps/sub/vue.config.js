const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  transpileDependencies: true,
  configureWebpack: {
    output: {
      library: `vue`,
      libraryTarget: "umd",
    },
  },
});
