import Cookie from 'js-cookie'
import { auth } from '@/plugins/firebase'

export const state = () => ({
  user: null
})

export const mutations = {
  SET_USER: (state, account) => {
    state.user = account
  },
  UNSET_USER: (state) => {
    state.user = null
  }
}

export const actions = {
  async login({ commit }, account) {
    // eslint-disable-next-line no-useless-catch
    try {
      // Login the user
      await auth.signInWithEmailAndPassword(account.email, account.password)

      // Get JWT from Firebase
      const token = await auth.currentUser.getIdToken()
      const { email, uid } = auth.currentUser

      // Set JWT to the cookie
      Cookie.set('access_token', token)

      // Set the user locally
      commit('SET_USER', { email, uid })
    } catch (error) {
      throw error
    }
  },
  async logout({ commit }) {
    await auth.signOut()
    await Cookie.remove('access_token')
    commit('UNSET_USER')
  }
}
