<template>
  <div class="container mx-auto overflow-hidden">
    <div class="flex flex-col items-center">
      <div class="m-10 flex flex-col items-center">
        <h1 class="text-5xl mb-5">Science Spelling Test</h1>
        <h2 class="text-xl">❤ by Teacher Amirah ❤</h2>
      </div>
      <ul class="m-5">
        <li>
          <router-link to="/">Main Menu</router-link>
        </li>
      </ul>
    </div>
    <hr />
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceIn"
    >
      <router-view />
    </transition>
  </div>
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
