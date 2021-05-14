<template>
  <nav v-if="isLogin">
    <div class="navbar-left-container">
      <router-link :to="{name: 'Home'}">
        <div class="navbar-item">
            <img src="@/assets/logo.png" class="" alt="logo"/>
            <h4 class="logo">MY PAGE</h4>
        </div>
      </router-link>
      <div class="navbar-item">
        <Search/>
      </div>
      <div><router-link class="navbar-item nav-link" :to="{ name: 'Home' }">首页</router-link></div>
    </div>
    <div class="navbar-right-container">
        <router-link :to="{name: 'Write'}">
          <div class="navbar-item nav-link">
            Publish
          </div>
        </router-link>
        <router-link :to="{name: 'UserCenter'}">
          <div class="navbar-item nav-link">
              Profile
          </div>     
        </router-link>
        <router-link :to="{name: 'Start'}" @click="signout">
          <div class="navbar-item nav-link">
            Exit
          </div>
        </router-link>
    </div>
  </nav>
  <nav v-else>
    <div class="navbar-left-container">
      <router-link :to="{name: 'Home'}" @click="signout">
        <div class="navbar-item">
            <img src="@/assets/logo.png" class="" alt="logo"/>
            <h4 class="logo">MY PAGE</h4>
        </div>
      </router-link>
      <div class="navbar-item">
        <Search/>
      </div>
      <div><router-link class="navbar-item" :to="{ name: 'Home' }">首页</router-link></div>
    </div>
    <div class="navbar-right-container">
        <router-link :to="{name: 'LoginInterface'}">
          <div class="navbar-item">
            Login
          </div>
        </router-link>
        <router-link :to="{name: 'SignUpInterface'}">
          <div class="navbar-item">
              Sign up
          </div>     
        </router-link>
    </div>
  </nav>
</template>

<script>
import Search from '@/components/Search.vue'
import authorize from '@/utils/authorization.js'
export default {
  name: 'Nav',
  components: { Search },
  data () {
    return {
      email: null,
      isLogin: false
    }
  },
  mounted () {
    authorize().then(response => {
        this.isLogin = response[0];
    })
  },
  methods: {
    signout() {
      localStorage.clear();
    }
  }
}
</script>

<style scoped>
nav{
    height: 10vh;
    left: 0;
    top: 0;
    margin: auto;
    display: flex;
    align-items: center;
    /* background-color: var(--light-blue); */
    border-bottom: 1px solid #d3d3d3;
}
.navbar-left-container {
  display: flex;
  flex: 2;
  align-items: center;
}
.navbar-left-container .navbar-item {
  margin-left: 2.5rem;
}

.navbar-right-container {
  display: flex;
  justify-content: flex-end;
  flex: 1;
  margin-right: 5%;
  align-items: center;
}
.navbar-right-container .navbar-item {
  margin-right: 2.5rem;;
}
.navbar-item {
  display: flex;
  align-items: center;
  color: var(--black);
  text-decoration: none;
}
.navbar-item img {
  height: 24px;
}

.nav-link:hover {
  background-color: #bda870;
}
</style>