const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/belgian-radios-skipper/' : '/',
  outputDir: 'docs',
  devServer: {
    https: true
  }
})
