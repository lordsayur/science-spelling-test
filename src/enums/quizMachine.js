export default {
  state: {
    ANSWERING: "answering",
    QUESTION_FINISH: "questionFinish",
    QUIZ_FINISH: "quizFinish",
  },
  transition: {
    COMPLETE: 'COMPLETE',
    CORRECT: 'CORRECT',
    NEXT_QUESTION: 'NEXT_QUESTION',
    TIMEOUT: 'TIMEOUT'
  }
};