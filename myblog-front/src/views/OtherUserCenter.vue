<template>
  <Nav/>
  <div class="profile-container">
    <div class="avatar-editor">
      <div class="avatar-container">
        <el-avatar shape="square" :size="150" fit="scale-down" :src="photoURL"></el-avatar>
      </div>
    </div>
    <div class="profile-content">
      <div class="profile-header">
        <span class="profile-username">
          {{ userProfile.username }}
        </span>
      </div>
      <div class="profile-edit-fields">
        <div class="field">
          <h3 class="field-label">邮箱</h3>
          <div>
            <span class="field-content">{{ userProfile.email }}</span>
          </div>
        </div>
        <div class="field">
          <h3 class="field-label">一句话介绍</h3>
          <div>
            <span class="field-content">{{ userProfile.intro }}</span>
          </div>
        </div>
        <div class="field">
          <h3 class="field-label">国家</h3>
          <div>
            <span class="field-content">{{ userProfile.country }}</span>
          </div>
        </div>
        <div class="field">
          <h3 class="field-label">城市</h3>
          <div>
            <span class="field-content">{{ userProfile.city }}</span>
          </div>
        </div>
        <div class="field">
          <h3 class="field-label">邮政编码</h3>
          <div>
            <span class="field-content">{{ userProfile.zip }}</span>
          </div>
        </div>
        <div class="field">
          <h3 class="field-label">地址</h3>
          <div>
            <span class="field-content">{{ userProfile.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer theme="light"/>
</template>

<script>
import axios from 'axios'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserCenter',
  components: {Nav, Footer},
  props: ['id'],
  data() {
    return {
      userProfile: {
        username: '',
        email: '',
        address: '',
        country: '',
        city: '',
        zip:'',
        intro: '',
        photo: '',     // photo的URL用于显示图片
      },
    }
  },
  beforeCreate() {
    // 设置页面的body尺寸
    document.body.style.width = '70%';
  },
  computed: {
    // 返回图片请求的地址
    photoURL() {
      if(this.userProfile) {
        if(this.userProfile.photo){
          return this.userProfile.photo;
        }
      }
      return '#';
    }
  },
  mounted() {
    // 获取其他用户的信息, retrieve获取信息不需要传送token
    axios.get('/blog/user/' + this.id)
    .then(response => {
      // 读取服务器返回的信息
      this.userProfile.username = response.data.username
      this.userProfile.email = response.data.email
      this.userProfile.intro = response.data.profile.intro
      this.userProfile.address = response.data.profile.address
      this.userProfile.city = response.data.profile.city
      this.userProfile.zip = response.data.profile.zip
      this.userProfile.country = response.data.profile.country
      this.userProfile.photo = response.data.profile.photo.value
      console.log(this.userProfile)
    })
    .catch (() => {
      ElMessage.error('err')
    })
  }
}
</script>

<style scoped>

.profile-username {
  display: inline-block;
  overflow: hidden;
  /* 连续的空白符会被合并，换行符无效 */
  white-space: nowrap;
  font-weight: bold;
  font-size: 2rem;
  line-height: 3rem;
}

.field {
  padding: 3rem 0;
  display: flex;
  border-bottom: 1px solid #d3d3d3;
}

.field-content {
  padding-left: 2rem;
  font-size: 1.4rem;
}

button {
  outline: none;
  border: 0;
  cursor: pointer;
  background-color: #4e8cdd;
  color: #fff;
  margin: 0 0.5rem;
  border-radius: 0.2rem;
}

.profile-container {
  padding: 1rem;
  margin-bottom: 3rem;
  display: flex;
}

.profile-content {
  flex: 4;
}

.avatar-editor {
  flex: 1;
  text-align: center;
}

.edit-area {
  margin-bottom: 0.5rem;
}

.field h3 {
  flex: 1;
  padding-left: 1rem;
  margin: 0;
}

.field div {
  flex: 5;
}

.avatar-container {
  width: 5rem;
  margin-bottom: 0.5rem;
}


</style>