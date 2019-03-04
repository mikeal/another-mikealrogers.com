module.exports = {
  title: 'Mikeal Rogers',
  description: 'Collected works of Mikeal Rogers.',
  ga: 'UA-3515839-5',
  serviceWorker: true,
  host: '0.0.0.0',
  themeConfig: {
    search: false
  },
  extendMarkdown: md => {
    const render = (tokens, idx) => {
      if (tokens[idx].nesting === 1) {
        return '<section class="slide"><div class="align-middle">'
      } else {
        return '</div></section>\n'
      }
    }
    md.use(require('markdown-it-container'), 'slide', { render })
  },
  configureWebpack: {
    output: {
      filename: '[name].[hash].js'
    }
  }
}

