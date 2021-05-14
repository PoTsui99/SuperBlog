<template>
    <router-view/>  
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>

html{
  scroll-behavior: smooth;
  /* background-color: #a9a9a9; */
  box-sizing: border-box;
  font-size: 16px;
}


body {
  box-sizing: border-box;
  overflow-x: hidden; 
  background-color: #f5f5d5;
  margin: 0 auto;
}

#app {
  font-family: Georgia, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  --text-gray: #3f4954;
  --white: #ffffff;
  --midnight: #104f55;
  --black: #2a2a2a;
  --light-blue: #66ccff;
  --text-white: rgb(189, 181, 181);
  --light-green: #f5f5d5;
}

/*-------------- Global classes ---------------------- */

a {
  text-decoration: none;
  color: var(--text-gray);
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.center-row {
  justify-content: space-between;
}

ul {
  list-style: none;
}

h1, h2, h3 {
  color: #2a2a2a;
}

/* 下划线为虚线 */
.bottom-dashed {
  border-bottom: 1px dashed #d3d3d3;
}

.bottom-solid {
  border-bottom: 1px solid #d3d3d3;
}

/* 设置用户中心界面的el-input的样式 */
.el-input.edit-area .el-input__inner {
  background-color: rgb(224, 236, 176);
}


/* 正文编辑区的textarea */
.el-textarea.input-text .el-textarea__inner {
  resize: none;
  border: 0;
  width: 100%;
  min-height: 1.3rem;
  background: transparent;
  outline: none;
  margin-bottom: 1rem;
  font-size: 1rem;
  padding-bottom: 3rem;
}

/* 隐藏el-textarea的滚动条 */
.el-textarea.input-text .el-textarea__inner::-webkit-scrollbar {
  display: none;
}

/*-------x------ Global classes ----------x----------- */
</style>