import moment from 'moment'
import { StoreDB } from '~/plugins/firebase'

export const state = () => ({
  recipesList: []
})

export const getters = {
  // allRecipes: state => state.recipes
}
export const actions = {
  fetchRecipes({ commit }) {
    const recipeArray = []
    return StoreDB.collection('recipes')
      .where('publish', '==', true)
      .orderBy('updated', 'desc')
      .limit(6)
      .get()
      .then((querySnapshot) => {
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
        console.log(recipeArray)
        commit('setRecipes', recipeArray)
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('Something went wrong here, Enable Debug')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

export const mutations = {
  setRecipes(state, payload) {
    state.recipesList.push(payload)
  }
  // setRecipes: (state, recipesList) => (state.recipesList = recipesList)
}
