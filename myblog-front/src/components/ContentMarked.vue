<template>
  <h1 id="title">{{ article.title }}</h1>
  <!-- 如果是预览模式，则不需要显示副标题 -->
  <div id="subtitle" v-if="!isPreview">
    <p>
      作者: 
      <!-- 需要传整数user_id -->
      <router-link v-if="article" :to="{name: 'OtherUserCenter', params: {id: parseInt(article.user_id)}}">
        {{ article.user }}
      </router-link>
    </p>
    <p>发布于: {{ formatTime(article.created) }}</p>
    <p>相关类别: 
      <abbr title="无相关标签" v-if="article.tags.length == 0">无相关标签</abbr>
      <abbr v-for="(tag, index) in article.tags" :key="index" :title="tag.name">
        <!-- 搜索和该标签相关的文章 -->
        <router-link :to="{name: 'Home', query: {searchText: tag.name}}">
          {{ tag.name }}
        </router-link>
      </abbr>
    </p>
  </div>
  <div v-html="compileMarkdown" class="article-content markdown-body"></div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'ContentMarked',
  props: { 
    article: Object, 
    // 如果是预览功能，则不需要subtitle，只要标题和正文
    isPreview: {
      type: Boolean,
      default: false
    }},
  computed: {
    compileMarkdown() {
      return marked(this.article.body, {santize: true})
    }
  },
  methods: {
    formatTime(isoTimeString) {
      const date = new Date(isoTimeString)
      return date.toLocaleDateString()
    }
  }
}
</script>

<style scoped>
  #title {
    font-size: x-large;
    border-bottom: 2px solid #d3d3d3;
    padding-bottom: 1rem;
  }

  #subtitle {
      color: gray;
      font-size: middle;
  }

  .article-content {
    padding-bottom: 2rem;
  }

  .article-content p img {
    max-width: 100%;
    border-radius: 5rem;
    box-shadow: gray 0 0 20px;
  }

  abbr {
    text-decoration: none;
    margin-left: 0.5rem;
  }
  
</style>