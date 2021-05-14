<template>
  <StartNav/>
  <main>
      <section class="presentation">
          <div class="introduction">
              <div class="intro-text">
                  <h1>记录生活的新方式</h1>
              </div>
              <div class="cta">
                <router-link :to="{ name: 'SignUpInterface' }">
                    <button class="cta-contact">创建账号</button>
                </router-link>
              </div>
          </div>
          <div class="cover">
              <img src="../assets/dotted-shape.png"/>
          </div>
      </section>
      <section class="info">
          <div class="nav-content-container">
            <h1><a id="explore">开始探索</a></h1>
            <p>分享日常生活</p>
            <p>技术博客</p>
            <p>美食</p>
            <p>旅行</p>
            <p>....</p>
          </div>
          <div class="nav-content-container">
            <h1><a id="features">特性</a></h1>
            <p>支持markdown编辑</p>
            <p>远程存储</p>
          </div>
          <div class="nav-content-container">
            <h1><a id="about-us">关于我们</a></h1>
            <p>联系方式: xxxxxxxxxxxx</p>
          </div>
      </section>
  </main>
  <Footer theme="dark"/>
</template>

<script>
import StartNav from '@/components/StartNav.vue'
import Footer from '@/components/Footer.vue'
import authorization from '@/utils/authorization.js'

export default {
  name: 'Start',
  components: { StartNav, Footer },
  beforeCreate() {
      document.body.style.width = '100%';
  },
  mounted() {
    authorization().then(response => {
        let hasLogin = false;
        hasLogin = response[0];
        if(hasLogin === true) {
            this.$router.push({name: 'Home'})
        }
    });
  }
}
</script>

<style scoped>

.introduction{
    flex: 1;
}

.nav-content-container,
.intro-text{
    font-size: 33px;
    font-weight: 500;
    background: linear-gradient(to right, #e58737, #e0cba6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.info p,
.intro-text p{
    margin-top: 5px;
    font-size: 22px;
}
main {
    background-color: #28272b;
}
.presentation{
    display: flex;
    width: 90%;
    margin: auto;
    align-items: center;
    min-height: 100vh;
}
.cover{
    flex: 1;
}
.cover img{
    height: 60vh;
}
.cta{
    padding: 50px 0px 0px 0px
}
.cta-contact{
    border: 2px solid #ec962f;
    background: transparent;
    color: #ec962f;
    width: 150px;
    height: 50px;
    cursor: pointer;
}
li{
    list-style: none;
}
.info{
    width: 90%;
    margin: auto;
    align-items: center;
}
.nav-content-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>