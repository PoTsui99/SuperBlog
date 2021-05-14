<template>
  <div class="login-header">
    <router-link :to="{name: 'Start'}">
      <img src="@/assets/logo.png" class="" alt="logo"/>
    </router-link>
  </div>
  <main>
    <div class="signup-form">
      <h3>注册账号</h3>
      <div class="form-elem">
        <span class="field-label">头像：</span>
        <div class="content-container">
          <input class="field-content" type="file" @change="submitAvatar"/>
        </div>
      </div>
      <div class="form-elem">
        <span class="field-label">用户名：</span>
        <!-- <input class="field-content" placeholder="请输入用户名" type="email" v-model="signupForm.username"/> -->
        <div class="content-container">
          <el-input
            type="text"
            v-model="signupForm.username"
            maxlength="30"
            minlength="0"
            class="edit-area"
          >
          </el-input>
        </div>
      </div>
      <div class="form-elem">
        <span class="field-label">邮箱：</span>
        <!-- <input class="field-content" placeholder="请输入邮箱" type="email" v-model="signupForm.email"/> -->
        <div class="content-container">
          <el-input
            type="text"
            v-model="signupForm.email"
            maxlength="50"
            minlength="0"
            class="edit-area"
          >
          </el-input>
        </div>
      </div>
      <div class="form-elem">
        <span class="field-label">密码：</span>
        <!-- <input class="field-content" placeholder="请输入密码" type="password" v-model="signupForm.password"/> -->
        <div class="content-container">
          <el-input
            type="password"
            v-model="signupForm.password"
            maxlength="128"
            minlength="0"
            class="edit-area"
            show-password
          >
          </el-input>
        </div>
      </div>
      <div class="form-elem">
        <span class="field-label">确认密码：</span>
        <!-- <input class="field-content" placeholder="请输入密码" type="password" v-model="signupForm.password"/> -->
        <div class="content-container">
          <el-input
            type="password"
            v-model="signupForm.confirmPassword"
            maxlength="128"
            minlength="0"
            class="edit-area"
            show-password
          >
          </el-input>
        </div>
      </div>
      <div class="form-elem">
        <button @click.prevent="submitForm">注册</button>
      </div>
    </div>
  </main>

  <Footer/>
</template>

<script scoped>
  // var validateEmail = (rule, value, callback) => {
  //   const reg = new RegExp(
  //     "^[a-z0-9]+[a-z0-9_]*[a-z0-9]@([a-z0-9]+[a-z0-9_]*[a-z0-9].){1,100}[a-z0-9]+$"
  //   )
  //   if(value === '') {
  //     callback(new Error('请输入邮箱'));
  //   }
  //   else if(!reg.test(this.registerForm.email)) {
  //     callback(new Error('请输入正确格式的邮箱'));
  //   }
  //   callback();
  // };
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import Footer from '@/components/Footer'
  export default {
    name: 'SignUp',
    components:{ Footer },
    beforeCreate() {
      document.body.style.width = "30%";
    },
    data() {
      return {
        signupForm: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          photo_id: ''    // 用于接收post图片后返回的图片id
        },
      };
    },
    methods: {
      validateForm() {
        let flag = true;
        const reg = new RegExp(
          "^[a-z0-9]+[a-z0-9_]*[a-z0-9]@([a-z0-9]+[a-z0-9_]*[a-z0-9].){1,100}[a-z0-9]+$"
        )
        if(this.signupForm.username == '') {
          ElMessage.warning('用户名字段不能为空');
          flag = false;
        }
        else if(this.signupForm.email == '') {
          ElMessage.warning('邮箱字段不能为空');
          flag = false;
        }
        else if(this.signupForm.password == '') {
          ElMessage.warning('密码不能为空');
          flag = false;
        }
        else if(!reg.test(this.signupForm.email)) {
          ElMessage.warning('请输入正确格式的邮箱');
          flag = false;
        }
        // else if(this.signupForm.username.length < 5) {
        //   ElMessage.warning('用户名至少输入5个字符');
        //   flag = false;
        // }
        else if(this.signupForm.password.length < 6) {
          ElMessage.warning('密码至少输入6位');
          flag = false;
        }
        else if(this.signupForm.photo_id === '') {
          ElMessage.warning('请选择用户头像');
          flag = false;
        }
        else if(this.signupForm.password != this.signupForm.confirmPassword) {
          ElMessage.warning('两次密码输入不一致');
          flag = false;
        }
        return flag;
      },
      submitForm() {
        if(!this.validateForm()) {
          return ;
        }
        axios 
          // 表单的格式提交
          .post('blog/user/', {
            username: this.signupForm.username,
            email: this.signupForm.email,
            password: this.signupForm.password,
            // 只有username, email, password字段是User表的信息
            profile: {
              photo_id: this.signupForm.photo_id,
            }
          })
          .then(response => {
            this.signupResponse = response.data;
            ElMessage.success('注册成功');
            this.$router.push({ name: 'LoginInterface' })
          })
          .catch((err)=> {
            console.log(err.response.data)
            if(err.response.data.username) {
              ElMessage.error('用户名重复');
            }
            else if(err.response.data.email) {
              ElMessage.error('邮箱重复');
            }
            else {
              ElMessage.error('未知错误，请重新注册');
            }
          })
      },
      submitAvatar(e) {
        const avatarFile = e.target.files[0]
        let formData = new FormData();
        formData.append("value", avatarFile);
        axios
          .post('photo/', formData, {
            // 表明发送数据的类型
            headers: { 'Content-Type': 'multipart/form-data'}
          })
          .then(response => {
            // 表单中的头像id信息填入上传的图片在数据库中保存的id
            this.signupForm.photo_id = response.data.id;
            ElMessage.success("头像上传成功")
          })
      }
    }
  }
</script>

<style scoped>

  main {
    text-align: center;
  }

  .form-elem {
      padding: 10px;
      display: flex;
  }
  input {
      height: 25px;
      padding-left: 10px;
  }
  button {
      height: 35px;
      cursor: pointer;
      border: none;
      outline: none;
      background: gray;
      color: whitesmoke;
      border-radius: 5px;
      width: 60px;
  }


  .content-container {
    flex: 4;
  }

  .field-label {
    flex: 1;
  }

  .signup-form {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 30%;
    height: 60%;
    box-shadow:
        inset 0 -3em 3em rgba(0,0,0,0.1),
              0 0  0 2px rgb(197, 197, 181),
              0.3em 0.3em 1em rgba(0,0,0,0.3);
  }

  button {
    margin-left: 80%;
  }

  .login-header {
    height: 50%;
    margin: 4rem 0;
    text-align: center;
  }

  .login-header img {
    height: 3rem;
  }
  
</style>


