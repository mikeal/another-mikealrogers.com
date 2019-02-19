module.exports = {
  title: 'Mikeal Rogers',
  description: 'Collected works of Mikeal Rogers.',
  ga: 'UA-3515839-5',
  serviceWorker: true,
  themeConfig: {
    search: false
  },
  configureWebpack: {
    output: {
      filename: '[name].[hash].js'
    }
  }
}

