<template>
  <section class="articleList">
    <div v-for="article in articleInfo.results" :key="article.id" class="article-item">
      <div>
        <span v-for="tag in article.tags"
              :key="tag"
              class="tag">
          {{ tag.name }}
        </span>
      </div>
      <router-link :to="{ name: 'ArticleDetail', params: {id: article.id} }">
        <div class="article-title">{{ article.title }}</div>
      </router-link>
      <div>{{ formatTime(article.created) }}</div>
    </div>
    <div id="paginator">
      <span v-if="ifPrevPageExists">
        <router-link :to="getPath('previous')">
          Prev
        </router-link>
      </span>
      <span class="current-page">
        {{ currentPage }}
      </span>
      <span  v-if="ifNextPageExists">
        <router-link :to="getPath('next')">
          Next
        </router-link>
      </span>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ArticleList',
  data () {
    return {
      articleInfo: '', // 获取的文章列表
    }
  },
  computed: {
    // 判断上一页是否存在数据
    ifPrevPageExists() {
      return this.articleInfo.previous !== null
    },
    // 判断下一页是否存在数据
    ifNextPageExists() {
      return this.articleInfo.next !== null
    },
    currentPage() {
      if('page' in this.$route.query) {
        return this.$route.query.page;          
      }
      return 1
    }
  },
  methods: {
    formatTime(isoTimeString) {
      const date = new Date(isoTimeString)
      return date.toLocaleDateString()
    },
    // 获取文章列表的信息
    getArticleData() {
      let url = '/blog/article';
      // 如果prev page为1, 则服务器端直接返回的previous没有参数page, 所以需要判断
      let paramsExists = false
      if ('page' in this.$route.query && this.$route.query.page != null) {
        const page = Number(this.$route.query.page)
        url = this.appendParam(url, 'page', page, paramsExists)
        paramsExists = true
      }
      if ('searchText' in this.$route.query && this.$route.query.searchText !== null) {
        const searchText = this.$route.query.searchText
        url = this.appendParam(url, 'searchText', searchText, paramsExists)
        paramsExists = true
      }
      axios
          .get(url)
          .then(response => (this.articleInfo = response.data))
    },
    // 向路由路径中添加参数
    appendParam(url, name, val, paramsExists) {
      if(paramsExists === false) {
        return url + '/?' + name + '=' + val
      }
      return url + '&' + name + '=' + val
    },
    // 获取访问的路由路径
    getPath(direction) {
      try {
        let url_string;
        switch (direction) {
          case 'next':
            url_string = this.articleInfo.next
            break
          case 'previous':
            url_string = this.articleInfo.previous
            break;
          default:
            return ''
        }
        const url = new URL(url_string)
        return url.search
      }
      catch (e) {
        return ''
      }
    },
  },
  mounted () {
    this.getArticleData()
  },
  watch: {
    $route() {
      this.getArticleData()
    }
  }
}
</script>

<style scoped>
  .articleList {
      background-color: var(--light-green);
      text-align: center;
  }

  .article-item {
    margin-top: 1rem;
  }

  .article-title {
      font-size: large;
      font-weight: bolder;
      color: black;
      text-decoration: none;
      padding: 5px 0 5px 0;
  }

  .tag {
    padding: 2px 5px 2px 5px;
    margin: 5px 5px 5px 0;
    font-family: Georgia, Arial, sans-serif;
    font-size: small;
    background-color: #4e4e4e;
    color: whitesmoke;
    border-radius: 5px;
  }

  #paginator {
      text-align: center;
      padding-top: 50px;
  }

  a {
      color: black;
  }

  .current-page {
      font-size: x-large;
      font-weight: bold;
      padding-left: 10px;
      padding-right: 10px;
  }
</style>