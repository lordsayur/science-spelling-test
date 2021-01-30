import { createStore } from 'vuex'

import quizzes from './modules/quizzes';
import questions from './modules/questions';

export default createStore({
  modules: {
    quizzes,
    questions
  }
})
