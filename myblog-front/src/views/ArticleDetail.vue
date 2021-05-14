<template>
  <Nav/>
  <article v-if="article" class="article-container">
    <div class="article-inner">
      <!-- 文章内容部分 -->
      <ContentMarked :article="article"/>
      <p><abbr title="文档结束" style="text-decoration: none">（完）</abbr></p>
      <!-- 文章文档信息 -->
      <div class="article-footer">
        <h3>文档信息</h3>
        <ul>
          <li>
            <p>发布于：<abbr :title="article.created">{{ formatTime(article.created) }}</abbr></p>
          </li>
          <li>
            <p>上次编辑：<abbr :title="article.updated">{{ formatTime(article.updated) }}</abbr></p>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div>
      <h3>目录</h3>
      <div v-html="article.html_topic" class="toc"></div>
    </div> -->
    <div>
      <!-- 登陆后才会有操作栏 -->
      <div class="actions-container" v-if="isLogin">
        <button :class="{'action-btn': true, 'voted': hasVoted, 'not-voted': !hasVoted}" @click="switchVote" ref="voteButton">
          <i class="el-icon-caret-top"></i>
          赞同 {{ article.like_count }}
        </button>
        <button class="action-btn delete-button" @click="handleDeleteArticle" v-if="hasModifiedPermission()">
          <i class="el-icon-delete"></i>
          删除
        </button>
        <button class="action-btn edit-button" @click="editArticle" v-if="hasModifiedPermission()">
          <i class="el-icon-edit"></i>
          编辑
        </button>
      </div>
    </div>
    <Comment :article="article"/>
  </article>
  <Footer theme="light"/>
</template>

<script>
import axios from 'axios'
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
import Comment from '@/components/Comment.vue'
import ContentMarked from '@/components/ContentMarked.vue'
import { ElMessage } from 'element-plus'
import authorize from '@/utils/authorization.js'

export default {
  name: 'ArticleDeatil',
  components: { Nav, Footer, ContentMarked, Comment },
  props: ['id'],
  data () {
    return {
      article: '',
      hasVoted: false,
      isLogin: false
    }
  },
  beforeCreate() {
    // 设置body的width
    document.body.style.width = '65%';
  },
  mounted () {
    // 请求文章数据
    axios
      .get('blog/article/' + this.id)
      .then(response => {
        this.article = response.data;
        // 获取当前登陆的用户, 如果当前用户已经赞过该文章，则设置hasVoted
        let userid = parseInt(localStorage.getItem('userid'));
        if(this.article.like_persons.includes(userid)) {
          this.hasVoted = true;
        }
      })
      .catch((err) => {
        if(err.response.status == '404') {
          this.$router.push({name: 'Home'});
        }
        else {
          ElMessage.error('未知错误');
          this.$router.push({name: 'Home'});
        }

      })
    // 检验用户是否登陆，用于权限控制
    authorize().then(response => {
        this.isLogin = response[0];
    })
  },
  methods: {
    hasModifiedPermission() {
      // console.log(this.article.user == localStorage.getItem('username'));
      return this.article.user == localStorage.getItem('username');
    },
    formatTime(isoTimeString) {
      const date = new Date(isoTimeString);
      return date.toLocaleDateString()
    },
    // 点击点赞按钮
    switchVote() {
      console.log('switch vote');
      // 如果已经点赞过，再次点击为取消点赞
      if(this.hasVoted) {
        // 传递文章id和用户id，用于建立文章和用户的连接
        axios.post('/blog/votedown/', {
          id: this.article.id,
          user_id: localStorage.getItem('userid')
        }).then(response => (this.article.like_count = response.data.like_count))
        this.hasVoted = false;
      }
      // 点赞
      else {
        axios.post('/blog/voteup/', {
          id: this.article.id,
          user_id: localStorage.getItem('userid')
        }).then(response => (this.article.like_count = response.data.like_count))
        this.hasVoted = true;
      }
    },
    handleDeleteArticle() {
      this.$confirm('确定删除这篇文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 点击确定的事件
      .then(() => {
        this.deleteArticle()
      })
      // 点击取消的事件
      .catch(() => {
        ElMessage.success('已取消')
      })
    },
    // 删除文章，只有管理员才能使用
    deleteArticle() {
      console.log('delete article');
      axios
        .delete('/blog/article/' + this.article.id + '/', 
                { headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog') }})
        .then(() => {
          ElMessage.success('文章已删除');
          this.$router.push({name: 'Home'});
        })
        .catch(err => {
          console.log('delete' + err)
        }) 
    },
    // 修改文章，只有管理员才能使用
    editArticle() {  
      // 将id传入编辑界面，在编辑界面中重新请求数据，也可以将这些数据存储到session中
      this.$router.push({
        name: 'ArticleEdit', 
        params: {
          id: this.article.id,
        }
      })
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    id (newVal, oldVal) {
      axios
      .get('blog/article/' + newVal)
      .then(response => {this.article = response.data});
    }
  }
}
</script>

<style scoped>
  .article-footer {
    background-color: rgb(190, 122, 170);
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  .article-footer h3 {
    border-bottom: 1px solid rgb(95, 91, 91);
  }

  .article-footer ul {
    list-style-type: square;
  }

  .article-footer abbr {
    text-decoration: none;
  }

  .toc ul {
      list-style-type: none;
  }

  .toc a {
      color: gray;
  }

  button {
    padding: 1.2rem, 1.7rem;
    border: none;
    outline: none;
    border-radius: 0.5rem;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .actions-container {
    margin: 2rem 0;
  }

  .action-btn {
    margin-right: 1rem;
    background: rgba(0,102,255,.1);
    line-height: 2.2rem;
    padding: 0 0.6rem;
  }

  .voted {
    background-color: rgba(56, 55, 54, 0.1);
  }

  .not-voted {
    background-color: rgba(0,102,255,.1);
  }

</style>