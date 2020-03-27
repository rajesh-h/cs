<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <v-row v-if="paging.loading">
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
      <v-row v-if="!paging.loading">
        <v-col
          v-for="(recipe, i) in recipes"
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

            <v-card-actions>
              <v-card-subtitle>{{
                recipe.updatedFmt | truncate(11, '')
              }}</v-card-subtitle>
              <v-spacer></v-spacer>
              <div>
                <v-btn icon color="secondary">
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
                <v-btn icon color="secondary">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
// import moment from 'moment'
import { StoreDB } from '@/services/fireinit.js'

export default {
  components: {},
  filters: {
    truncate(text, length, suffix) {
      return text.substring(0, length) + suffix
    }
  },
  data() {
    return {
      recipes: [],
      paging: {
        recipes_per_page: 6,
        end: false,
        loading: false
      },
      ref: {
        recipes: null,
        recipesNext: null
      }
    }
  },
  created() {
    /* Set common Firestore reference */
    this.ref.recipes = StoreDB.collection('recipes')
      .where('publish', '==', true)
      .orderBy('updated', 'desc')

    /* Load first page */
    const firstPage = this.ref.recipes.limit(this.paging.recipes_per_page)
    this.handleRecipes(firstPage)
  },
  methods: {
    loadMore() {
      if (this.paging.end) {
        return
      }

      this.paging.loading = true
      this.handleRecipes(this.ref.recipesNext).then((documentSnapshots) => {
        this.paging.loading = false

        if (documentSnapshots.empty) {
          /* If there is no more recipes to load, set paging.end to true */
          this.paging.end = true
        }
      })
    },
    handleRecipes(ref) {
      /*
                Fetch recipes of given reference
            */
      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((documentSnapshots) => {
            /* If documentSnapshots is empty, then we have loaded all of pages */
            if (documentSnapshots.empty) {
              this.paging.end = true
              resolve(documentSnapshots)
            }

            documentSnapshots.forEach((doc) => {
              const recipeData = doc.data()
              recipeData.id = doc.id
              this.recipes.push(recipeData)
            })
            // eslint-disable-next-line no-console
            console.log(this.recipes)

            /* Build reference for next page */
            const lastVisible =
              documentSnapshots.docs[documentSnapshots.size - 1]

            if (!lastVisible) {
              return
            }

            this.ref.recipesNext = this.ref.recipes
              .startAfter(lastVisible)
              .limit(this.paging.recipes_per_page)

            resolve(documentSnapshots)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Something Went Wrong')
            reject(error)
          })
      })
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
