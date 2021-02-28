<template>
  <section id="debug" v-if="env == 'development'">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: "Debug",

  setup() {
    return {
      env: process.env.NODE_ENV,
    };
  },
};
</script>

<style>
</style>