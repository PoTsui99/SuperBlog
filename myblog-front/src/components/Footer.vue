<template>
  <div>
    <div :class="{'dark-background': theme == 'dark'}" style="height: 3.5rem"></div>
    <footer>
      <p :class="{ 'light-background': theme == 'light', 'dark-background': theme == 'dark', 'footer-container': true }">
        Is that the thing ? @2021 Created by 宁玉恒
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  props: { 'theme': String },
}
</script>

<style scoped>

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-weight: bold;
}
footer p {
  color: #b1afaf;
  font-size: 1rem;
  line-height: 2;
  margin-bottom: 0;
}

.dark-background {
  background-color: #181818;
}

.light-background {
  background: whitesmoke;
}

</style>