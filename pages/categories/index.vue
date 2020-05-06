<template>
  <v-layout column justify-center align-center>
    <v-row>
      <v-col cols="12">Click the category to find the relevant recipes </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(category, index) in categories" :key="index" cols="3">
        <v-btn block @click="gotoCategoryPage(category)">{{ category }}</v-btn>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  async fetch({ store }) {
    await store.dispatch('recipes/fetchCategories')
  },
  computed: {
    ...mapGetters({
      categories: 'recipes/categories'
    })
  },
  methods: {
    gotoCategoryPage(slug) {
      this.$router.push({
        name: 'categories-slug',
        params: { slug }
      })
    }
  },

  head() {
    return {
      title: 'Categories',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'categories',
          name: 'Categories',
          content: 'Categories'
        }
      ]
    }
  }
}
</script>

<style></style>
