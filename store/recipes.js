import moment from 'moment'
import { StoreDB } from '~/plugins/firebase'

export const state = () => ({
  recipesList: [],
  lastRecipe: null,
  initialRecipesLoaded: false,
  morePostsLoading: false,
  noMorePosts: false,
  recipeDetail: {}
})

export const getters = {
  getList: (state) => state.recipesList,
  getInitialRecipesLoaded: (state) => state.initialRecipesLoaded,
  getRecipeDetail: (state) => state.recipeDetail
}
export const actions = {
  async fetchList({ commit }) {
    const recipeArray = []
    return await StoreDB.collection('recipes')
      .where('publish', '==', true)
      .orderBy('updated', 'desc')
      .limit(6)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          commit('setNoMorePosts', true)
          return
        }
        const lastVisible = querySnapshot.docs[querySnapshot.size - 1]
        querySnapshot.forEach((doc) => {
          const UpdatedFmt = moment(new Date(doc.data().updated)).format(
            'DD-MMM-YYYY hh:mm'
          ) // date object
          recipeArray.push({
            ...doc.data(),
            id: doc.id,
            updatedFmt: UpdatedFmt
          }) // Using spread operator to add ID of the document to array
        })
        // eslint-disable-next-line no-console
        // console.log(lastVisible.data().updated.toString())
        commit('setLast', lastVisible.data().updated) // This is the cursor to be used for next set
        commit('setList', recipeArray)
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log('Something went wrong here, Enable Debug')
        // make sure to change catch method to add (e) for debug .catch((e) => {
        // eslint-disable-next-line no-console
        // console.log(e)
      })
  },
  async appendList({ commit, state }) {
    commit('setMorePostsLoading', true)
    const recipeArray = []
    return await StoreDB.collection('recipes')
      .where('publish', '==', true)
      .orderBy('updated', 'desc')
      .startAfter(state.lastRecipe)
      .limit(6)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          commit('setNoMorePosts', true)
          return
        }
        const lastVisible = querySnapshot.docs[querySnapshot.size - 1]
        querySnapshot.forEach((doc) => {
          const UpdatedFmt = moment(new Date(doc.data().updated)).format(
            'DD-MMM-YYYY hh:mm'
          ) // date object
          recipeArray.push({
            ...doc.data(),
            id: doc.id,
            updatedFmt: UpdatedFmt
          }) // Using spread operator to add ID of the document to array
        })
        // eslint-disable-next-line no-console
        // console.log(recipeArray)
        commit('setLast', lastVisible.data().updated) // This is the cursor to be used for next set
        commit('appendList', recipeArray)
        commit('setMorePostsLoading', false)
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log('Something went wrong here, Enable Debug')
        // eslint-disable-next-line no-console
        // make sure to change catch method to add (e) for debug .catch((e) => {
        // console.log(e)
      })
  },
  async fetchRecipeDetail({ commit }, slug) {
    const requestedPost = []
    return await StoreDB.collection('recipes')
      .where('slug', '==', slug)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const UpdatedFmt = moment(new Date(doc.data().updated)).format(
            'DD-MMM-YYYY hh:mm'
          ) // date object
          requestedPost.push({
            ...doc.data(),
            id: doc.id,
            updatedFmt: UpdatedFmt
          }) // Using spread operator to add ID of the document to array
        })
        commit('setRecipeDetail', requestedPost[0])
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log('Something went wrong here, Enable Debug')
        // make sure to change catch method to add (e) for debug .catch((e) => {
        // eslint-disable-next-line no-console
        // console.log(e)
      })
  }
}

export const mutations = {
  setList(state, payload) {
    state.recipesList = payload
    state.initialRecipesLoaded = true
  },
  appendList(state, payload) {
    state.recipesList = [...state.recipesList, ...payload]
  },
  setLast(state, payload) {
    state.lastRecipe = payload
  },
  setMorePostsLoading(state, payload) {
    state.morePostsLoading = payload
  },
  setNoMorePosts(state, payload) {
    state.noMorePosts = payload
  },
  setRecipeDetail(state, payload) {
    state.recipeDetail = payload
  }
  // setRecipes: (state, recipesList) => (state.recipesList = recipesList)
}
