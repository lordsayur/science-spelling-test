const state = () => ({
  quizzes: [
    {
      id: 1,
      title: "Spelling Test 1",
      isVisible: true,
      questionsId: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
      id: 2,
      title: "Spelling Test 2",
      isVisible: true,
      questionsId: [9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      id: 3,
      title: "Spelling Test 3",
      isVisible: true,
      questionsId: [17, 18, 19, 20, 21, 22, 23, 24]
    },
  ]
})

const getters = {
  getAllQuizzes: state => {
    return state.quizzes
  },
  getQuizDetails: (state) => {
    return (id) => {
      return state.quizzes.find(s => s.id == id);
    }
  }
}

const mutations = {
  updateValue: (state, payload) => {
    state.quizzes = payload
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