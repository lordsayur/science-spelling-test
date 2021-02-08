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
    {
      id: 4,
      title: "Spelling Test 4",
      isVisible: true,
      questionsId: [25, 26, 27, 28, 29, 30, 31, 32]
    },
    {
      id: 5,
      title: "Spelling Test 5",
      isVisible: true,
      questionsId: [33, 34, 35, 36, 37, 38, 39, 40]
    },
    {
      id: 6,
      title: "Spelling Test 6",
      isVisible: true,
      questionsId: [41, 42, 43, 44, 45, 46, 47, 48]
    },
    {
      id: 7,
      title: "Spelling Test 7",
      isVisible: true,
      questionsId: [49, 50, 51, 52, 53, 54, 55, 56]
    },
    {
      id: 8,
      title: "Spelling Test 8",
      isVisible: true,
      questionsId: [57, 58, 59, 60, 61, 62, 63]
    },
    {
      id: 9,
      title: "Spelling Test 9",
      isVisible: true,
      questionsId: [64, 65, 66, 67, 68, 69, 70, 71]
    },
    {
      id: 10,
      title: "Spelling Test 10",
      isVisible: true,
      questionsId: [72, 73, 74, 75, 76, 77, 78, 79]
    },
    {
      id: 11,
      title: "Spelling Test 11",
      isVisible: true,
      questionsId: [80, 81, 82, 83, 84, 85, 86, 87]
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