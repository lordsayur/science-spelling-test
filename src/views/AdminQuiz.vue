<template>
  <div class="flex flex-col items-center m-20">
    <h1 class="text-5xl">
      {{ quizDetials.title }}
    </h1>
    <ul>
      <li
        v-for="(question, questionIndex) in questions"
        :key="question.id"
        class="text-5xl p-10 border-b-4 border-yellow-100"
      >
        <div class="flex flex-row items-baseline text-4xl">
          <div
            v-for="(letter, index) in getLetters(questionIndex)"
            :key="index"
            class="flex flex-col justify-center items-center m-3"
          >
            <input
              :class="`${
                questions[questionIndex].isCorrect[index]
                  ? 'border-gray-900'
                  : 'border-red-500'
              } h-16 w-16 text-center m-5 border-4 rounded-lg`"
              type="text"
              maxlength="1"
              v-model="questions[questionIndex].letters[index]"
            />
            <button>Hide</button>
          </div>
          <button class="rounded-full h-10 w-10 bg-yellow-300">+</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import getQuizDetails from "../composables/getQuizDetails.js";

export default {
  name: "AdminQuiz",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { quizDetials, questions, getLetters } = getQuizDetails(props.id);

    return {
      quizDetials,
      questions,
      getLetters,
    };
  },
};
</script>

<style>
</style>