<template>
  <v-container column justify-center align-center>
    <v-row v-if="loading">
      <v-col v-for="(n, i) in 6" :key="i" cols="12" sm="6" md="6" lg="4">
        <v-skeleton-loader
          :loading="loading"
          class="mx-auto"
          width="300"
          max-width="400"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-if="!loading && recipesLoaded">
      <v-col
        v-for="(recipe, i) in latestRecipes"
        :key="i"
        cols="12"
        sm="6"
        md="6"
        lg="4"
      >
        <v-card class="mx-auto" :to="recipe.slug">
          <v-img
            v-if="recipe.featuredImage"
            class="white--text align-end"
            height="200px"
            :src="recipe.featuredImage"
            :lazy-src="require('~/static/placeholder_image.png')"
          >
            <v-card-title
              class="pa-2"
              style="background-color: rgba(0, 0, 0, 0.5)"
            >
              <div class="ellipsis">{{ recipe.title }}</div></v-card-title
            >
          </v-img>

          <v-card-text class="text--primary">
            <div>{{ recipe.title }}</div>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-actions>
            <v-card-subtitle class="pa-0">
              <v-btn outlined text disabled
                ><v-icon small left>mdi-account-group</v-icon
                >{{ recipe.serves }}
              </v-btn>
              <v-btn outlined text disabled
                ><v-icon small left>mdi-clock-outline</v-icon
                >{{ recipe.totalTime }}
              </v-btn>
            </v-card-subtitle>

            <v-spacer></v-spacer>
            <div>
              <!-- <v-btn icon @click="setOrRemoveBookmark">
                <v-icon>mdi-bookmark-outline</v-icon>
              </v-btn>
              <v-btn icon @click="shareRecipe">
                <v-icon>mdi-share-variant</v-icon>
              </v-btn> -->
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      v-if="!loading && recipesLoaded && !noMorePosts"
      outlined
      block
      class="ma-2"
      :loading="morePostsLoading"
      :disabled="morePostsLoading"
      color="secondary"
      @click="fetchMoreRecipes"
    >
      Load More Recipes
    </v-btn>

    <v-btn v-if="noMorePosts" disabled block color="info"
      >NO MORE RECIPES</v-btn
    >
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {},
  filters: {
    truncate(text, length, suffix) {
      return text.substring(0, length) + suffix
    }
  },
  async fetch({ params, store }) {
    const payload = { forDashboard: false, limit: 6, category: params.slug }
    await store.dispatch('recipes/fetchCategorySearchResults', payload)
  },

  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      latestRecipes: 'recipes/categorySearchResults'
      // recipesLoaded: 'recipes/getInitialRecipesLoaded'
    }),
    recipesLoaded() {
      return this.$store.state.recipes.initialRecipesLoaded
    },
    morePostsLoading() {
      return this.$store.state.recipes.morePostsLoading
    },
    noMorePosts() {
      return this.$store.state.recipes.noMorePosts
    }
  },
  mounted() {
    this.loading = false
  },
  created() {},
  methods: {
    ...mapActions({
      fetchMore: 'recipes/appendList'
    }),
    fetchMoreRecipes() {
      this.fetchMore({ forDashboard: false, limit: 6 })
    },
    setOrRemoveBookmark() {
      alert('This Feature To be introduced')
    },
    shareRecipe() {
      alert('This Feature To be introduced')
    }
  },
  head() {
    return {
      title: this.$route.params.slug,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: this.$route.params.slug,
          name: this.$route.params.slug,
          content: this.$route.params.slug
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.ellipsis {
  text-overflow: ellipsis;
  /* Required for text-overflow to do anything */
  white-space: nowrap;
  overflow: hidden;
}
</style>
