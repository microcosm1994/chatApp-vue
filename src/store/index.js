import vuex from 'vuex'
import Vue from 'vue'
import VuexPersistence from 'vuex-persist'

Vue.use(vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, data) {
      state.user = data
    }
  },
  plugins: [vuexLocal.plugin]
})
