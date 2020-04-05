import moment from 'moment'
import { StoreDB } from '~/plugins/firebase'

export const state = () => ({
  recipesList: [],
  lastRecipe: null,
  initialRecipesLoaded: false,
  morePostsLoading: false,
  noMorePosts: false,
  recipeDetail: {},
  noSingleRecipeFetched: false
})

export const getters = {
  list: (state) => state.recipesList,
  initialRecipesLoaded: (state) => state.initialRecipesLoaded,
  recipeDetail: (state) => state.recipeDetail,
  noSingleRecipeFetched: (state) => state.noSingleRecipeFetched
}
export const actions = {
  async fetchList({ commit }, payload) {
    const recipeArray = []
    let response
    if (payload.forDashboard) {
      response = StoreDB.collection('recipes')
        .orderBy('updated', 'desc')
        .limit(payload.limit)
    } else {
      response = StoreDB.collection('recipes')
        .where('publish', '==', true)
        .orderBy('updated', 'desc')
        .limit(payload.limit)
    }
    return await response
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
  async appendList({ commit, state }, payload) {
    commit('setMorePostsLoading', true)
    const recipeArray = []
    let response
    if (payload.forDashboard) {
      response = StoreDB.collection('recipes')
        .orderBy('updated', 'desc')
        .startAfter(state.lastRecipe)
        .limit(payload.limit)
    } else {
      response = StoreDB.collection('recipes')
        .where('publish', '==', true)
        .orderBy('updated', 'desc')
        .startAfter(state.lastRecipe)
        .limit(payload.limit)
    }
    return await response
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
  async fetchRecipeDetail({ commit, state }, slug) {
    commit('setNoSingleRecipeFetched', false)
    const requestedPost = []
    const found = state.recipesList.find((x) => x.slug === slug)
    if (found) {
      commit('setRecipeDetail', found)
      return await true
    } else {
      return await StoreDB.collection('recipes')
        .where('slug', '==', slug)
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            commit('setNoSingleRecipeFetched', true)
            // eslint-disable-next-line no-console
            console.log('Query empty')
          } else {
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
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log('Something went wrong here, Enable Debug')
          // make sure to change catch method to add (e) for debug .catch((e) => {
          // eslint-disable-next-line no-console
          // console.log(e)
        })
    }
  },
  async addRecipe({ dispatch }, dataArray) {
    const response = StoreDB.collection('recipes')
    try {
      await response.add(dataArray).then((res) => {
        // eslint-disable-next-line no-console
        // console.log('Added document with ID: ', res.id)
        const newID = res.id // Id received from the added recipe
        dispatch('fetchRecipeDetailBasedOnId', newID) // Pass the newID as param for this action
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('There was a error adding data')
      // eslint-disable-next-line no-console
      console.log(e)

      alert(e)
      return
    }
    alert('New Recipe Added.')
  },
  async editRecipe({}, dataArray) {
    // eslint-disable-next-line no-console
    // console.log(dataArray)
    const ID = dataArray.id
    // console.log ()
    const response = StoreDB.collection('recipes').doc(ID)
    try {
      await response.set(dataArray, { merge: true }).then(() => {
        // eslint-disable-next-line no-console
        // console.log(res)
        // eslint-disable-next-line no-console
        // console.log('Added document with ID: ', res.id)
        // const newID = res.id // Id received from the added recipe
        // dispatch('fetchRecipeDetailBasedOnId', ID) // Pass the newID as param for this action
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('There was a error editing data')
      // eslint-disable-next-line no-console
      console.log(e)

      alert(e)
      return
    }
    alert('Recipe Edited.')
  },
  async fetchRecipeDetailBasedOnId({ commit }, newID) {
    const response = StoreDB.collection('recipes').doc(newID)
    try {
      const newAddedRecipe = await response.get()
      // eslint-disable-next-line no-console
      // console.log(newAddedRecipe.data())
      if (newAddedRecipe.data().publish === true) {
        commit('addNewRecipeToList', { ...newAddedRecipe.data(), id: newID })
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(
        'Error Fetching Data from firestore, As Precaution Error message is not printed here. Go Ahead and print error message on debug mode'
      )
      // eslint-disable-next-line no-console
      // console.log(e)
      // alert(e)
      alert('Error Fetching Data, please contact Webmaster')
    }
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
  },
  setNoSingleRecipeFetched(state, payload) {
    state.noSingleRecipeFetched = payload
  },
  addNewRecipeToList(state, recipe) {
    state.recipesList.unshift(recipe)
  }
  // setRecipes: (state, recipesList) => (state.recipesList = recipesList)
}
