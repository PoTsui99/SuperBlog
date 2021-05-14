<template>
  <section>
    <h2 class="bottom-solid">留言（{{ comments.length }}条）</h2>
    <!-- 登陆才能评论 -->
    <div v-if="isLogin" class="comment-box" ref="commentBox">
      <!-- 默认1行 -->
      <!-- <ResizeByMixin/> -->
      <textarea rows=1 class="comment-input" :placeholder="commentPlaceholder" @input="autoResize"
       @focus="onFocus()" @blur="onBlur()" v-model="commentText" ref="commentInput"/>
      <div class="btn" v-if="btnShow">
        <button type="button" @click="cancleBtn">取消</button>
        <button type="button" class="comment-button" @click="publishComment()">发布</button>
      </div>
    </div>
    <div class="comments">
      <div v-for="(comment, index) in comments" :key="comment.like_count"  class="comment-item bottom-dashed">
        <!-- 评论内部 -->
        <div class="comment-inner">
          <div class="comment-header">
            <p>
              <span class="comment-username">
                <strong>
                  {{ comment.user.username }}
                </strong>
                <span> 说：</span>
              </span>
            </p>
          </div>
          <div class="comment-content">
            <div v-if="comment.quote_comment != null">
              <blockquote>
                <pre>引用{{ comment.quote_comment.user.username }}的发言：</pre>
                <p>{{ comment.quote_comment.content }}</p>
              </blockquote>
            </div>
            <!-- <p>{{ comment.content }}</p> -->
            <p v-for="(paragraph, index) in splitedComment(comment.content)" :key="index">
              {{ paragraph }}
            </p>
          </div>
          <div class="comment-footer">
            <p>
              <abbr :title="comment.created">{{ formatTime(comment.created) }}</abbr>
              <span v-if="isLogin"> | </span>
              <!-- 登陆了才能回复 -->
              <a v-if="isLogin" href="#" @click.prevent="quoteComment(comment.id, comment.user.username)">引用</a>
              <span v-if="hasDeletePermission(comment.user.id)"> | </span>
              <a v-if="hasDeletePermission(comment.user.id)" href="#" @click.prevent="handleDeleteComment(index)">删除</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ElMessage } from 'element-plus'
import axios from 'axios'
import authorize from '@/utils/authorization.js'

export default {
  name: 'Comment',
  components: {  },
  props: { article: Object },   // 父组件传入article对象，从article对象中取出评论
  data() {
    return {
      comments: [],             // 该文章下的所有评论
      commentText: '',          // 用户输入评论框下的内容
      quoteCommentID: null,     // 如果存在，引用评论的id
      btnShow: false,            // 是否显示评论区下的'cancle'和'publish'两个按钮
      commentPlaceholder: '发表公开评论',
      isLogin: false
    }
  },
  mounted() {
    // 文章的直接评论的 .reply_user为null表示回复文章的评论
    this.comments = this.article.comments
    // 检验用户是否登陆，用于权限控制
    authorize().then(response => {
        this.isLogin = response[0];
    })
  },
  methods: {
    // 是否有删除评论的权限，判断是不是评论所有者或文章所有者
    hasDeletePermission(userid) {
      return localStorage.getItem('userid') == userid || localStorage.getItem('userid') == this.article.user_id;
    },
    formatTime(isoTimeString) {
      const date = new Date(isoTimeString);
      return date.toLocaleDateString();
    },
    // 提交评论前查看文章是否被删除
    checkArticleBeforePublish() {
      let flag = true;
      axios
          .get('/blog/article/' + this.article.id)
          .catch((err) => {
            flag = false;
            if(err.response.status == '404') {
              ElMessage('该文章不存在');
              this.$router.push({name: 'Home'});
              return ;
            }
            else {
              ElMessage.error('未知错误')
              this.$router.go(0);
              return ;
            }
          })
      return flag;
    },
    // 提交评论前查看评论是否被删除
    checkCommentBeforePublish() {
      console.log(this.quoteCommentID)
      let flag = true;
      if(this.quoteCommentID) {
        axios
            .get('/comment/comment/' + this.quoteCommentID)
            .catch((err) => {
              flag = false;
              console.log(err.response)
              if(err.response.status == '404') {
                ElMessage('该评论已被移除');
                this.$router.go(0);
                return ;
              }
            })
      }
      return flag;
    },
    publishComment() {
      // 发布评论按钮点击后调用，提交评论
      if(this.commentText.trim().length < 5) {
        ElMessage.warning('评论至少包含5个字符');
        return
      }
      const userid = localStorage.getItem('userid');
      // 检查文章是否存在
      if(!this.checkArticleBeforePublish()) {
        return ;
      }
      // 检查引用的评论是否存在
      if(!this.checkCommentBeforePublish()) {
        return ;
      }
      axios
          .post('/comment/comment/', {
            user_id: userid,
            content: this.commentText,
            article_id: this.article.id,
            quote_comment_id: this.quoteCommentID
          })
          .then(response => {
            ElMessage.success('评论提交成功')
            let thisArticle = this.article;
            // 添加新评论至队头
            thisArticle.comments.unshift(response.data);
            this.commentText = '';
          })
      // 复原评论输入框
      let commentInput = this.$refs.commentInput;
      commentInput.style.height = 'auto'
      commentInput.height = `${commentInput.scrollHeight}px`
    },
    quoteComment(quoteCommentID, username) {
      // 点击引用评论后调用
      // let commentInput = this.$refs.commentInput;
      this.commentText = '';
      this.quoteCommentID = quoteCommentID;
      // commentInput.placeholder = "回复" + username;
      this.commentPlaceholder = "回复" + username;
    },
    onFocus() {
      let commentInput = this.$refs.commentInput;
      commentInput.style.borderBottomColor = '#333';
      if(this.quoteCommentID == null) {
        // commentInput.placeholder = '';
        this.commentPlaceholder = '';
      }
      this.btnShow = true;
    },
    onBlur() {
      let commentInput = this.$refs.commentInput;
      if(this.quoteCommentID == null) {
        // commentInput.placeholder = '发表公开评论';
        this.commentPlaceholder = '发表公开评论';
      }
      commentInput.style.borderBottomColor = '#aaa';
    },
    // 取消回复的内容、回复的状态，隐藏按钮
    cancleBtn() {
      let commentInput = this.$refs.commentInput;
      // commentInput.placeholder = '发表公开评论';
      this.commentPlaceholder = '发表公开评论';
      this.btnShow = false;
      this.commentText = '';
      this.quoteCommentID = null;
      // 复原评论输入框
      commentInput.style.height = 'auto'
      commentInput.height = `${commentInput.scrollHeight}px`
    },
    // nice function :-)
    autoResize(event) {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    },
    // 返回评论段按照'\n'分割后的一个个段落，用<p>标签做换行使用
    splitedComment(commentContent) {
      return commentContent.split('\n');
    },
    // 添加中间层确认框
    handleDeleteComment(index) {
      this.$confirm('确定删除该评论？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 点击确定的事件
      .then(() => {
        this.deleteComment(index);
      })
      // 点击取消的事件
      .catch(() => {
        ElMessage.success('已取消')
      })
    },
    // 根据评论数组下标删除评论
    deleteComment(index) {
      const commentid = this.article.comments[index].id;
      axios
          .delete('/comment/comment/' + commentid + '/',
            { headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog') }})
          .then(() => {
            ElMessage.success('评论已删除');
            let thisArticle = this.article;
            thisArticle.comments.splice(index, 1);
          })
          .catch((err) => {
            if(err.response.status == '404') {
              ElMessage.warning('该评论已被移除');
              this.$router.go(0);
            }
            else {
              ElMessage.error('未知错误');
              this.$router.go(0);
            }
          })
    }
  }
}
</script>

<style scoped>

.comment-header {
  margin: 1rem 0 0 0;
}

.comment-content {
  margin: 0 0 0 1rem;
}

.comment-footer {
  margin-left: 60%;
}

p {
  margin-left: 1rem;
  margin-top: 1rem;
}

a {
  text-decoration: underline;
}

blockquote {
  background-color: rgb(231, 225, 165);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

/* 调整评论框 */
textarea {
  resize: none;
  border: 0;
  width: 100%;
  min-height: 1.3rem;
  background: transparent;
  outline: none;
  margin-bottom: 1rem;
}

textarea {
  border-bottom: 2px solid #aaa;
  max-height: 50vh;
}

textarea::-webkit-scrollbar {
  display: none;
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

.comment-button {
  background-color: #065fd4;
  color: #fff;
}

button {
  color: #333;
  background-color: transparent;
  margin-left: 1rem;
}

button:hover {
    color: #333;
    background-color: rgb(231, 217, 154);
}

.btn {
  padding-left: 85%;
}

h2 {
  padding-bottom: 0.5rem;
}

</style>