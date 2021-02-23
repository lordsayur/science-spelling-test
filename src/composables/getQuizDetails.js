import { computed, reactive } from 'vue';
import { useStore } from 'vuex';

export const getQuizDetails = (id) => {
  const store = useStore();

  const quizDetials = store.getters["quizzes/getQuizDetails"](id);
  const questions = reactive({
    data: store.getters["questions/getQuestions"](quizDetials.questionsId),
    get total() { return this.data.length },
    getLetters(question) {
      return this.data[question].letters
    },
    getHiddenLetters(question) {
      return this.data[question].hidden
    },
    getAnswers(question) {
      return this.data[question].answers
    },
    getAnswerValues(question) {
      return Object.values(this.data[question].answers)
    },
    isSomeAnswersMissing(question) {
      return Object.values(this.data[question].answers).some((answer) => {
        return answer == ""
      })
    },
    isAllAnswersCorrect(question) {
      return Object.values(
        questions.getIsCorrect(question)
      ).every((correct) => correct)
    },
    getCorrectAnswers(question) {
      return this.data[question].correctAnswers
    },
    getIsCorrect(question) {
      return this.data[question].isCorrect
    },
    get total() { return this.data.length }
  });

  const getLetters = computed(() => {
    return (index) => {
      return questions.getLetters(index).split("");
    }
  });



  return {
    quizDetails,
    questions,

    getLetters
  }
}