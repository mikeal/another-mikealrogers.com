<template>
  <div id="blog-recent">
    <div v-for="post in posts">
      <router-link :to="post.path">
        <h2>{{post.frontmatter.title}}</h2>
        <p>{{post.frontmatter.description}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    posts () {
      let posts = this.$site.pages.filter(p => p.type === 'post')
      return posts
    }
  }
}
</script>
