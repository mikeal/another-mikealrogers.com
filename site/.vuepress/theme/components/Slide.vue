<template>
  <main class="slide">

    <Content/>

    <footer class="page-edit">
      <div
        class="edit-link"
        v-if="editLink"
      >
        <a
          :href="editLink"
          target="_blank"
          rel="noopener noreferrer"
        >{{ editLinkText }}</a>
        <OutboundLink/>
      </div>

      <div
        class="last-updated"
        v-if="lastUpdated"
      >
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </footer>

    <div class="page-nav" v-if="prev || next">
      <p class="inner">
        <span
          v-if="prev"
          class="prev"
        >
          ←
          <router-link
            v-if="prev"
            class="prev"
            :to="prev.path"
          >
            {{ prev.title || prev.path }}
          </router-link>
        </span>

        <span
          v-if="next"
          class="next"
        >
          <router-link
            v-if="next"
            :to="next.path"
          >
            {{ next.title || next.path }}
          </router-link>
          →
        </span>
      </p>
    </div>

  </main>
</template>

<script>
import { resolvePage, normalize, outboundRE, endingSlashRE } from '../util'

const isElementInViewport = el => {
  let rect = el.getBoundingClientRect()

  return rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */
}

const slideElements = () => Array.from(document.querySelectorAll('section.slide'))

const currentSlide = () => {
  let slides = slideElements()
  for (let i = 0; i < slides.length; i++) {
    if (isElementInViewport(slides[i])) return i
  }
}

export default {
  props: ['sidebarItems'],

  mounted () {
    const fwd = () => slideElements()[currentSlide() + 1].scrollIntoView(true)

    const back = () => slideElements()[currentSlide() - 1].scrollIntoView(true)

    const keyboardNav = (evt) => {
      const keyMap = {
        ArrowLeft: back,
        LeftArrow: back,
        ArrowUp: back,
        UpArrow: back,
        ArrowRight: fwd,
        RightArrow: fwd,
        ArrowDown: fwd,
        DownArrow: fwd,
        Space: fwd
      }
      for (let key of Object.keys(keyMap)) {
        if (evt.key.endsWith(key)) return keyMap[key]()
      }
    }

    document.addEventListener('keydown', keyboardNav)
  },

  computed: {
    lastUpdated () {
      return this.$page.lastUpdated
    },

    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },

    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },

    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },

    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }
      if (docsRepo && editLinks) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, path)
      }
    },

    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText
        || this.$site.themeConfig.editLinkText
        || `Edit this page`
      )
    }
  },

  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : repo
        return (
          base.replace(endingSlashRE, '')
           + `/src`
           + `/${docsBranch}`
           + (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '')
           + path
           + `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`

      return (
        base.replace(endingSlashRE, '')
        + `/edit/${docsBranch}`
        + (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '')
        + path
      )
    }
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  flattern(items, res)
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === decodeURIComponent(page.path)) {
      return res[i + offset]
    }
  }
}

function flattern (items, res) {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].type === 'group') {
      flattern(items[i].children || [], res)
    } else {
      res.push(items[i])
    }
  }
}

</script>

<style>

/* Palette 
  #4deeea - light blue
  #74ee15 - green
  #ffe700 - yellow 
  #f000ff - pink
  #001eff - dark blue
*/
@import url('https://fonts.googleapis.com/css?family=Abril+Fatface');
main.slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
}

section.slide img {
  max-width: 100%;
}

element {
  --pink: #f000ff
}

section.slide {
  background: #4deeea;
  color: #f000ff;
  width: 100vw;
  overflow-x: hidden;
  height: 100vh;
  min-height: 100vh;
  display: table;
  font-family: 'Abril Fatface', cursive;
  text-align: center;
  text-shadow:
    -1px -1px 0 white,
    1px -1px 0 white,
    -1px 1px 0 white,
    1px 1px 0 white;
}

section.slide p {
  font-size: 5vw;
}

.invert {
  background:white;
  color: black;
}

div.extra-class {
  color: white;
  text-shadow: none;
  margin-left: 1vw;
  margin-right: 1vw;
}

section.slide pre {
  font-size: 2.5vw; 
  text-shadow: none;
  font-color: white;
}

section.slide a {
  text-decoration: none;
  color: white;
}

section.slide ul {
  text-align: left;
}
section.slide ul li {
  font-size: 2.5vw;
  margin-left: 10vw;
}

.align-middle {
  display: table-cell;
  vertical-align: middle;
}

section.slide .white {
  color: white;
}

section.slide .text-shadow-dark {
  text-shadow: 1px 1px #333;
}
</style>
