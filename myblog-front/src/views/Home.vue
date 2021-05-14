<template>
  <Nav class="nav"></Nav>
  <main class="main">
    <ArticleList class="main-content"/>

    <Slider class="main-aside"/>
  </main>

  <Footer class="footer" theme="light"></Footer>
</template>

<script>
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
import ArticleList from '@/components/ArticleList.vue'
import Slider from '@/components/Slider.vue'


export default {
  name: 'Home',
  components: { Nav, Footer, ArticleList, Slider },
  beforeCreate() {
    // 设置页面的body尺寸
    document.body.style.width = "85%";
  },
  methods: {
    // 设置：如果当前localStorage中已经存储了未过期的token，则直接登录
  },
}
</script>

<style scoped>

main {
  display: flex;
  height: 83vh;
  margin: 0.5rem 0rem;
}

.main-content {
  flex: 4;
}

.main-aside {
  flex: 1;
  margin-left: 0.5rem;
}

</style>

