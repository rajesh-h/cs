<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <v-row v-if="!recipesLoaded">
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
          </v-card>
          <v-card>
            <v-card-actions>
              <v-card-subtitle class="pa-0">
                <!-- <v-btn outlined text disabled>{{
                  recipe.updatedFmt | truncate(11, '')
                }}
                </v-btn> -->
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
                <v-btn icon>
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>

    <v-btn
      v-if="recipesLoaded"
      outlined
      block
      class="ma-2"
      :loading="paging.loading"
      :disabled="paging.loading"
      color="secondary"
      @click="loadMoreRecipes"
    >
      Load More Recipes
    </v-btn>
    <!-- <div v-scroll:#scroll-target="onScroll"></div> -->
    <!-- <v-card v-intersect="loadMoreRecipes"></v-card> -->

    <v-btn v-if="paging.end" disabled block color="info">NO MORE RECIPES</v-btn>
  </v-layout>
</template>

<script>
import moment from 'moment'
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
      recipesLoaded: false,
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
    this.ref.recipes = StoreDB.collection('recipes')
      .where('publish', '==', true)
      .orderBy('updated', 'desc')
    const firstPage = this.ref.recipes.limit(this.paging.recipes_per_page)
    this.fetchRecipes(firstPage)
  },
  methods: {
    async fetchRecipes(ref) {
      // const recipeArray = []

      try {
        this.paging.loading = true
        await ref.get().then((querySnapshot) => {
          /* If documentSnapshots is empty, then we have loaded all of pages */
          if (querySnapshot.empty) {
            this.paging.end = true
            this.paging.loading = false
            return
          }
          /* Append recipes to list of recipes */
          querySnapshot.forEach((doc) => {
            const UpdatedFmt = moment(new Date(doc.data().updated)).format(
              'DD-MMM-YYYY hh:mm'
            ) // date object
            // recipeArray.push({
            this.recipes.push({
              ...doc.data(),
              id: doc.id,
              updatedFmt: UpdatedFmt
            }) // Using spread operator to add ID of the document to array
          })
          // eslint-disable-next-line no-console
          // console.log(this.recipes)
          // this.latest6recipes = recipeArray
          this.paging.loading = false
          this.recipesLoaded = true

          /* Build reference for next page */
          const lastVisible = querySnapshot.docs[querySnapshot.size - 1]

          if (!lastVisible) {
          }

          this.ref.recipesNext = this.ref.recipes
            .startAfter(lastVisible)
            .limit(this.paging.recipes_per_page)
        })
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
    },

    loadMoreRecipes() {
      if (this.paging.end) {
        return
      }

      this.paging.loading = true
      this.fetchRecipes(this.ref.recipesNext).then(() => {
        this.paging.loading = false

        // if (documentSnapshots.empty) {
        /* If there is no more recipes to load, set paging.end to true */
        // this.paging.end = true
        // }
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
