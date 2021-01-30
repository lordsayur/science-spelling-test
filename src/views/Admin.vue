<template>
  <div class="flex flex-col items-center">
    <h1 class="text-5xl">Admin</h1>
    <ul class="flex flex-row flex-wrap">
      <li
        v-for="quiz in quizzes"
        :key="quiz.id"
        class="text-4xl border-yellow-300 rounded-xl border p-5 m-5 cursor-pointer hover:bg-yellow-200"
        @click="navigateToQuiz(quiz.id)"
      >
        <span> ⭐{{ quiz.title }} </span>
      </li>
    </ul>
    <button
      class="text-2xl border-yellow-300 rounded-xl border p-5 m-5"
      @click="addQuiz"
    >
      Add
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Admin",
  setup() {
    const store = useStore();
    const router = useRouter();

    const quizzes = ref(store.getters["quizzes/getAllQuizzes"]);
    const deleteQuiz = (index) => {
      quizzes.value.splice(index, 1);
    };

    const addQuiz = () => {
      quizzes.value.push({
        id: 1,
        title: "Spelling Test 3",
        isVisible: true,
        questionsId: [],
      });
    };

    const navigateToQuiz = (id) => {
      router.push({ name: "AdminQuiz", params: { id: id } });
    };

    return {
      quizzes,
      deleteQuiz,
      addQuiz,
      navigateToQuiz,
    };
  },
};
</script>