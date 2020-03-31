<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <v-row v-if="false">
        <v-col v-for="(n, i) in 6" :key="i" cols="12" sm="6" md="6" lg="4">
          <v-skeleton-loader
            class="mx-auto"
            width="300"
            max-width="400"
            type="card"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <!-- <div v-if="!latestRecipesLoaded" class="text-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div> -->

      <v-row v-if="recipesLoaded">
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
                <v-btn icon @click="setOrRemoveBookmark">
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
                <v-btn icon @click="shareRecipe">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>

    <v-btn
      v-if="recipesLoaded && !noMorePosts"
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

    <!-- <div v-scroll:#scroll-target="onScroll"></div> -->
    <!-- <v-card v-intersect="loadMoreRecipes"></v-card> -->

    <v-btn v-if="noMorePosts" disabled block color="info"
      >NO MORE RECIPES</v-btn
    >
  </v-layout>
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
  async fetch({ store }) {
    await store.dispatch('recipes/fetchList')
  },

  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      latestRecipes: 'recipes/getList'
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
  created() {},
  methods: {
    ...mapActions({
      fetchMoreRecipes: 'recipes/appendList'
    }),
    setOrRemoveBookmark() {
      alert('This Feature To be introduced')
    },
    shareRecipe() {
      alert('This Feature To be introduced')
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
