export const state = () => ({})

export const actions = {
  async nuxtServerInit({ dispatch }, context) {
    await dispatch('recipes/fetchList', context)
  }
}
