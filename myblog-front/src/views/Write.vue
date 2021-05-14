<template>
  <Nav></Nav>
  <div class="write-header">
    <h3>发表文章</h3>
    <div class="operations-box">
      <button @click="hideShow()" class="preview-btn">Preview</button>
      <button type="text" @click="submitArticle" class="submit-btn">提交</button>
    </div>
  </div>
  <!-- if !showPreview 显示编辑文章板块 -->
  <div class="edit-area" v-show="!showPreview">
    <!-- <div>
      <input type="text" v-model="title" placeholder="请输入标题(最多40字)">
    </div> -->
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
      <!-- <textarea cols="30" rows="10" placeholder="请输入正文" v-model="inputText" @input="update"></textarea> -->
      <!-- <textarea class="input-text" rows=1 placeholder="请输入正文" @input="autoResize" v-model="inputText" ref="inputText"/> -->
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

export default {
  name: 'Write',
  components: { Nav, Footer, ContentMarked },
  beforeCreate() {
    // 设置页面的body尺寸
    document.body.style.width = '65%';
  },
  data () {
    return {
      title: '',
      tags: [
        'JAVA',
        'CPP',
        'C#'
      ],
      inputText: '',
      tempTag: '',
      showPreview: false,
    }
  },
  computed: {
    compileMarkdown() {
      return marked(this.inputText, {santize: true})
    },
    // 用于预览文章的信息
    articleForPreview() {
      return {
        title: this.title,
        body: this.inputText
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
    async submitArticle() {
      console.log('提交');
      if(!this.checkSubmit()) return
      let tags = [];
      // 这里的for-in循环是遍历下标, 循环将标签加入到列表中
      for(const index in this.tags) {
        tags.push({'name': this.tags[index]})
      }
      await axios.post('/blog/article/', {
        title: this.title,
        body: this.inputText,
        tags: tags,
        user: localStorage.getItem('username')
      }).then(response => {
      // 发表成功后接收到服务器端发送的文章编号之后跳转到文章详情页面
        ElMessage.success("发表成功!")
        console.log(response.data)
        const articleID = response.data.id
        this.$router.push({name: 'ArticleDetail', params: {id: articleID}})
      })
    },
    hideShow() {
      this.showPreview = !this.showPreview;
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

/* 
.input-text::-webkit-scrollbar {
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