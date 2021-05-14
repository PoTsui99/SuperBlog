<template>
  <aside class="right slider">
    <!-- 用户登录的情况下 -->
    <div class="user-desc" v-if="isLogin">
      <el-avatar class="user-avatar" shape="circle" :size="150" :fit="fit" :src="photoURL"></el-avatar>
      <h2>
        <abbr :title="userInfo.username">
          {{ username }}
        </abbr>
      </h2>
      <p><i v-if="userIntro !== ''"> "{{ userIntro }}" </i></p>
    </div>
    <!-- 游客状态 -->
    <div v-else>
      <h2>
        <abbr title="visitor">
          游客
        </abbr>
      </h2>
      <p><i v-if="userIntro !== ''"> "{{ userIntro }}" </i></p>
    </div>
    <hr/>
    <section class="tags-cloud">
      <h2>标签云</h2>
      <ul>
        <li v-for="tag in tags" :key="tag">
          <router-link :to="{ 
            name: 'Home', 
            query: { searchText: tag } }">
            {{ tag }}
          </router-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import axios from 'axios'
import authorize from '@/utils/authorization.js'

export default {
  name: 'Slider',
  data() {
    return {
      userInfo: '',
      fit: 'scale-down',
      tags: [],
      isLogin: false
    }
  },
  async mounted() {
    await authorize().then(response => {
        this.isLogin = response[0];
    })
    // 如果是登陆状态，则请求用户信息
    if(this.isLogin) {
      const userid = localStorage.getItem('userid');
      axios
        .get('/blog/user/' + userid, { headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog') }})
        .then(response => {
          this.userInfo = response.data
        });
    }
    this.getTags();
  },
  computed: {
    username() {
      // 等到加载完成
      if(this.userInfo) {
        return this.userInfo.username.length > 15 ? 
            this.userInfo.username.substring(0, 15) + '...' : this.userInfo.username;
      }
      return '';
    },
    userIntro() {
      if(this.userInfo) {
        if(this.userInfo.profile) {
          return this.userInfo.profile.intro.length > 15 ? 
              this.userInfo.profile.intro.substring(0, 15) + '...' : this.userInfo.profile.intro;
        }
      }
      return ''
    },
    photoURL() {
      if(this.userInfo){
         if(this.userInfo.profile) {
          return this.userInfo.profile.photo.value
        }
      }
      return '#'
    }
  },
  methods: {
    getTags() {
      axios
        .get('/blog/tag/')
        .then(response => {
          this.tags = []
          for(let i = 0; i < response.data.length; ++i) {
            this.tags.push(response.data[i].name)
          }
        })
    }  
  }
}
</script>

<style scoped>
aside {
  border-radius: 1rem;
  border: 1px solid #d3d3d3;
  /* background: var(--light-blue); */
  color: var(--black);
  text-align: center;
}

/* .tags-cloud {
  text-align: center;
} */

.tags-cloud ul {
  padding: 0;
}

.tags-cloud ul li {
  padding-top: 0.5rem;
}

/* 标签云的标签下设置下划线 */
.tags-cloud a {
  text-decoration: underline;
}

.user-avatar {
  margin: 1rem 0;
}

abbr {
  text-decoration: none;
}

</style>

