import questions from './data';
const state = () => ({
  questions
})

const getters = {
  getQuestions: state => {
    return (ids) => {
      return state.questions.filter(q => ids.includes(q.id))
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