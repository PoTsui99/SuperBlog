<template>
  <Nav></Nav>
  <div>
    <div class="write-header">
      <h3>编辑文章</h3>
      <div class="operations-box">
        <button @click="hideShow()" class="preview-btn">Preview</button>
        <button type="text" @click="submitArticle" class="submit-btn">提交</button>
      </div>
    </div>
    <!-- if !showPreview 显示编辑文章板块 -->
    <div class="edit-area" v-show="!showPreview">
      <textarea rows="1" class="write-title" placeholder="请输入标题（最多 100 个字）" 
        @keypress.enter.prevent="noNewline" v-model="title"/>
      <div class="write-tags-container">
        <i>文章标签：</i>
        <input type="text" class="tag-input" v-model="tempTag" @keyup.alt="addTag" placeholder="Alt + Enter"/>
        <div v-for="tag in tags" :key="tag" @click="deleteTag(tag)" class="pill">
          <span>{{ tag }}</span>
        </div>
      </div>
      <div class="input-text-container">
        <!-- <textarea class="input-text" rows=1 placeholder="请输入正文" @input="autoResize" v-model="inputText" ref="inputText" id="inputText"/> -->
        <el-input
          class="input-text"
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="inputText"
          ref="inputText">
        </el-input>
      </div>
    </div>
    <!-- else 显示预览文章 -->
    <div v-show=showPreview>
      <h2>预览</h2>
      <hr/>
      <!-- 预览的文章 -->
      <ContentMarked :article="articleForPreview" :isPreview="true"/>
    </div>
  </div>
  <Footer theme="light"></Footer>
</template>

<script>
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
// marked包用来显示markdown文件
import marked from 'marked'
import ContentMarked from '@/components/ContentMarked.vue'
import authorize from '@/utils/authorization.js'

export default {
  name: 'ArticleEdit',
  components: { Nav, Footer, ContentMarked },
  // 编辑界面不需要重新请求数据，直接接受传入的article对象
  // props: {
  //   articleID: String,    // 需要转换为整型
  //   articleTitle: String,
  //   articleBody: String,
  //   articleTags: Array,
  // },
  props: ['id'],
  beforeCreate() {
    // 设置页面的body尺寸
    document.body.style.width = '65%';
    console.log('created')
  },
  data () {
    return {
      // id: '',
      title: '',
      tags: [],
      inputText: '',
      tempTag: '',
      showPreview: false,
    }
  },
  mounted() {
    // this.id = parseInt(this.articleID);
    // this.title = this.articleTitle;
    // this.inputText = this.articleBody;
    // this.tags = this.articleTags;
    // 初始时将textarea调整为合适的高度
    // let inputText = this.$refs.inputText;
    // inputText.style.height = "auto";
    // inputText.style.height = `${inputText.target.scrollHeight}px`;
    // 请求文章数据
    axios
      .get('blog/article/' + this.id)
      .then(response => {
        // 编辑数据界面需要判断请求是否是文章作者发送的，若不是，则跳转到文章浏览页面
        // == 代表可以一个String一个Number
        // 不是所有者，不能进行编辑
        if(response.data.user_id != localStorage.getItem('userid')) {
          this.$router.push({name: 'ArticleDetail', params: {id: this.id}})
        }
        this.title = response.data.title;
        let  tags = response.data.tags;
        for(let index in tags) {
          this.tags.push(tags[index].name)
        }
        this.inputText = response.data.body;
      })
    // 检验用户是否登陆，用于权限控制
    authorize().then(response => {
        this.isLogin = response[0];
    })
  },
  computed: {
    compileMarkdown() {
      return marked(this.inputText, {santize: true})
    },
    // 用于预览文章的信息
    articleForPreview() {
      if(this.title && this.inputText) {
        return {
          title: this.title,
          body: this.inputText
        }
      }
      return {
        title: '',
        body: ''
      }
    }
  },
  methods: {
    addTag(e) {
      if(e.key == 'Enter' && this.tempTag && !this.tags.includes(this.tempTag)) {
        if(this.tags.length < 5) {
          this.tags.push(this.tempTag);
          this.tempTag = "";
        }
        else {
          ElMessage('最多添加5个标签');
        }
      }
    },
    deleteTag(tag) {
      this.tags = this.tags.filter((item) => {return item !== tag;});
    },
    checkSubmit(){
      let flag = false;
      if(this.title == '') {
        ElMessage.warning('请输入文章标题')
      }
      else if(this.inputText.length < 14) {
        ElMessage.warning('正文至少输入14个字符')
      }
      else {
        flag = true
      }
      return flag
    },
    // 提交patch请求
    async submitArticle() {
      console.log('提交');
      if(!this.checkSubmit()) return
      let tags = [];
      // 这里的for-in循环是遍历下标, 循环将标签加入到列表中
      for(const index in this.tags) {
        tags.push({'name': this.tags[index]})
      }
      await axios.patch('/blog/article/' + this.id + '/', {
        title: this.title,
        body: this.inputText,
        tags: tags,
      },{ 
        headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog') }
      }
      ).then(response => {
      // 发表成功后接收到服务器端发送的文章编号之后跳转到文章详情页面
        ElMessage.success("修改已提交!")
        console.log(response.data)
        this.$router.push({name: 'ArticleDetail', params: {id: this.id}})
      })
    },
    hideShow() {
      this.showPreview = !this.showPreview;
    },
    autoResize(event) {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    },
    noNewline(e) {
      console.log(e)
      console.log(this.title)
    }
  },
}
</script>

<style scoped>

.input-text-container {
  margin: 3rem 0;
  padding: 0 0 20rem 0;
}

/* 调整正文框样式 */
textarea {
  resize: none;
  border: 0;
  width: 100%;
  min-height: 1.3rem;
  background: transparent;
  outline: none;
  margin-bottom: 1rem;
  font-size: 1rem;
}

/* .input-text {
  max-height: 50vh;
} */

/* .input-text::-webkit-scrollbar {
  display: none;
} */

.write-header {
  padding: 0.5rem;
  border-bottom: 1px dashed #b3adad;
  display: flex;
  margin-bottom: 1rem;
}

h3 {
  flex: 1;
}

.operations-box {
  display: flex;
}

button {
  border: none;
  outline: none;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
}

button {
  width: 8rem;
  height: 3.5rem;
  margin: 0 0.5rem;
}

.submit-btn {
  background-color: rgb(224, 85, 85);
}

.preview-btn {
  background-color: pink;
}

.write-title {
  font-size: 2rem;
  white-space: nowrap;
}

.write-tags-container {
    margin: 1rem 0;
}

.tag-input {
  background-color: rgb(231, 227, 182);
  border: 1px solid rgb(23, 25, 161);
  border-radius: 0.3rem;
  margin-right: 1rem;
  color: rgb(165, 77, 146);
  outline: none;
  line-height: 1.3rem;
}

.pill {
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  display: inline-block;
  background: rgb(194, 196, 118);
  border-radius: 2rem;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  color: rgb(165, 77, 146);
  cursor: pointer;
}

</style>