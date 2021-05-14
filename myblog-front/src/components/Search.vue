<template>
  <el-input
    placeholder="请输入内容"
    v-model="searchText"
    @keyup.enter="search"
    class="search-Bar">
    <template #append>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <!-- <el-button icon="el-icon-search" ></el-button> -->
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchText: '',
    }
  },
  methods: {
    search () {
      if(this.searchText.trim() === "") return
      this.$router.push({
        name: 'Home',
        query: {
          searchText: this.searchText.trim()
        }
      })
      this.searchText = ''
    }
  }
}
</script>

<style>

</style>