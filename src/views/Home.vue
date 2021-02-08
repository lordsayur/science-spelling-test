<template>
  <div class="flex flex-col items-center">
    <ol>
      <template v-for="quiz in quizzes" :key="quiz.id">
        <li class="text-xl m-10">
          <router-link :to="{ name: 'Quiz', params: { id: quiz.id } }"
            >⭐{{ quiz.title }}</router-link
          >
        </li>
      </template>
    </ol>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "Home",
  setup() {
    const store = useStore();

    const quizzes = ref(store.getters["quizzes/getAllQuizzes"]);

    return {
      quizzes,
    };
  },
};
</script>

<style>
</style>
