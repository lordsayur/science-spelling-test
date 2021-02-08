import questions from './data';
const state = () => ({
  questions
})

const getters = {
  getQuestions: state => {
    return (ids) => {
      let questions = state.questions.filter(q => ids.includes(q.id))
      questions.forEach(question => {
        question.letters = question.letters[0].toUpperCase() + question.letters.substring(1)
      });
      return questions
    }
  }
}

const mutations = {
  updateValue: (state, payload) => {
    state.questions = payload
  }
}

const actions = {
  updateActionValue({ commit }) {
    commit('updateValue', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}