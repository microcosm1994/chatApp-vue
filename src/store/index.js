import vuex from 'vuex'
import Vue from 'vue'
import VuexPersistence from 'vuex-persist'

Vue.use(vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new vuex.Store({
  state: {
    user: null,
    target: null,
    group: null,
    groupMemberId: null,
    friendsId: null
  },
  mutations: {
    setUser (state, data) {
      state.user = data
    },
    setTarget (state, data) {
      state.target = data
    },
    setGroup (state, data) {
      state.group = data
    },
    setGroupMemberId (state, data) {
      state.groupMemberId = data
    },
    setFriendsId (state, data) {
      state.friendsId = data
    }
  },
  plugins: [vuexLocal.plugin]
})
