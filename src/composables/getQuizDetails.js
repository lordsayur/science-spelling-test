import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const getQuizDetails = (id) => {
  const store = useStore();

  const quizDetials = store.getters["quizzes/getQuizDetails"](id);
  const questions = ref(
    store.getters["questions/getQuestions"](quizDetials.questionsId)
  );

  const getLetters = computed(() => {
    return (index) => {
      return questions.value[index].letters.split("");
    }
  });



  return {
    quizDetials,
    questions,

    getLetters
  }
}

export default getQuizDetails