<template>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceIn"
    >
      <router-view />
    </transition>
  </div>
  <router-view/>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Pangolin&display=swap");
html {
  background: rgb(255, 254, 251);
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Pangolin", cursive;
  color: #2c3e50;
}
</style>
