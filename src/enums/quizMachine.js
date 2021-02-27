export default {
  state: {
    STARTING: 'starting',
    ANSWERING: "answering",
    QUESTION_FINISH: "questionFinish",
    QUIZ_FINISH: "quizFinish",
  },
  transition: {
    START: 'START',
    COMPLETE: 'COMPLETE',
    CORRECT: 'CORRECT',
    NEXT_QUESTION: 'NEXT_QUESTION',
    TIMEOUT: 'TIMEOUT'
  }
};