<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <div v-if="loading" class="text-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="secondary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-row v-if="!loading">
        <v-col cols="12" sm="12" md="9" lg="9">
          <v-card class="mx-auto">
            <v-img
              v-if="recipe.featuredImage"
              class="white--text align-end"
              :src="recipe.featuredImage"
              :lazy-src="require('~/static/placeholder_image.png')"
            >
              <v-card-title
                class="pa-4 justify-center"
                style="background-color: rgba(0, 0, 0, 0.5)"
              >
                <h4>{{ recipe.title }}</h4>
              </v-card-title>
              <div
                class="hidden-sm-and-down"
                style="
                position: absolute;
                top: 10px;
                right: 10px;
                min-width:250px;"
              >
                <v-simple-table
                  class="white--text"
                  style="background-color: rgba(0, 0, 0, 0.5);"
                >
                  <tbody>
                    <tr>
                      <td>Serves</td>
                      <td>{{ recipe.serves }}</td>
                    </tr>
                    <tr>
                      <td>Prep Time</td>
                      <td>{{ recipe.prepTime }}</td>
                    </tr>
                    <tr>
                      <td>Cook Time</td>
                      <td>{{ recipe.cookTime }}</td>
                    </tr>
                    <tr>
                      <td>Total Time</td>
                      <td>{{ recipe.totalTime }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-img>
          </v-card>

          <div class="pa-3">
            <v-btn class="ma-2 hidden-md-and-up" tile disabled text>
              <v-icon left>mdi-account-group</v-icon>{{ recipe.serves }}
            </v-btn>
            <v-btn class="ma-2 hidden-md-and-up" tile disabled text>
              <v-icon left>mdi-clock-outline</v-icon>{{ recipe.totalTime }}
            </v-btn>
            <v-btn class="ma-2" tile disabled text>
              <v-icon left>mdi-account-circle</v-icon>{{ recipe.author }}
            </v-btn>
            <v-btn class="ma-2" tile disabled text>
              <v-icon left>mdi-calendar</v-icon>{{ recipe.updatedFmt }}
            </v-btn>
            <v-btn icon color="secondary">
              <v-icon>mdi-bookmark-outline</v-icon>
            </v-btn>
            <v-btn icon color="secondary">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </div>
          <div class="pa-3" v-html="recipe.content"></div>
          <h3 class="text-center">RECIPE CARD</h3>
          <div
            class="pa-3"
            style="border:2px;border-color:orange;border-style:dotted;"
          >
            <v-row align="end" class="fill-height">
              <v-col align-self="center" class="pa-3" cols="4">
                <v-img
                  v-if="recipe.featuredImage"
                  height="auto"
                  width="225px"
                  :src="recipe.featuredImage"
                  :lazy-src="require('~/static/placeholder_image.png')"
                >
                </v-img>
              </v-col>
              <v-col
                align-self="center"
                class="pa-3"
                cols="8"
                sm="7"
                md="7"
                lg="7"
              >
                <h4 class="text-center">{{ recipe.title }}</h4>
              </v-col>
              <v-col align-self="start" class="hidden-xs-only pa-3" cols="1">
                <v-btn icon color="secondary">
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-simple-table class="text-center">
              <tbody>
                <tr>
                  <td>Serves</td>
                  <td>Prep Time</td>
                  <td>Cook Time</td>
                  <td>Total Time</td>
                </tr>
                <tr>
                  <td>{{ recipe.serves }}</td>
                  <td>{{ recipe.prepTime }}</td>
                  <td>{{ recipe.cookTime }}</td>
                  <td>{{ recipe.totalTime }}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <div>
              <h4 class="text-center pt-2">INGREDIENTS</h4>
              <div
                v-for="(recipeGroup, gindex) in recipe.recipeIngredients[0]"
                :key="gindex"
              >
                <h4 v-if="recipeGroup.name">{{ recipeGroup.name }}</h4>
                <v-row>
                  <v-col
                    v-for="(ingredient, iindex) in recipeGroup.ingredients"
                    :key="iindex"
                    class="px-3 py-1"
                    cols="6"
                    sm="6"
                    md="4"
                    lg="4"
                  >
                    {{ ingredient.ingredient }} --- {{ ingredient.quantity }}
                  </v-col>
                </v-row>
              </div>

              <p></p>
            </div>
            <div>
              <h4 class="text-center pt-2">RECIPE STEPS</h4>
              <div
                v-for="(recipeGroup, index) in recipe.recipeSteps"
                :key="index"
              >
                <h4 v-if="recipeGroup.group.name">
                  {{ recipeGroup.group.name }}
                </h4>
                <p
                  v-for="(step, sindex) in recipeGroup.group.steps"
                  :key="sindex"
                >
                  {{ step.text }}
                </p>
              </div>
            </div>
            <div>
              <h4 v-if="recipe.recipeNotes" class="text-center pt-2">
                RECIPE NOTES
              </h4>
              <div v-if="recipe.recipeNotes" class="pa-2">
                <p>{{ recipe.recipeNotes }}</p>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="3" lg="3">
          <h4 class="text-center pt-2">
            CATEGORIES
          </h4>
          <div>
            <v-chip
              v-for="(category, cindex) in recipe.categories"
              :key="cindex"
              outlined
              class="ma-2"
            >
              {{ category }}
            </v-chip>
          </div></v-col
        >
      </v-row>
    </v-flex>
  </v-layout>
</template>
<script>
import moment from 'moment'
import { StoreDB } from '@/services/fireinit.js'

export default {
  data: () => ({
    recipe: {},
    loading: true
  }),
  created() {
    this.fetchSingleRecipe(this.$route.params.slug)
  },
  methods: {
    async fetchSingleRecipe(slug) {
      // Fetch Single Recipe by passing Id
      const requestedPost = []
      const response = StoreDB.collection('recipes')
      try {
        await response
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
              this.recipe = requestedPost[0]
              this.loading = false
            })
          })
        // eslint-disable-next-line no-console
        console.log(this.recipe)
        // eslint-disable-next-line no-console
        // console.log(newAddedRecipe.data())
        // eslint-disable-next-line no-console
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
          'Error Fetching Data from firestore, As Precaution Error message is not printed here. Go Ahead and print error message on debug mode'
        )
        // eslint-disable-next-line no-console
        console.log(e)
        // alert(e)
        alert('Error Fetching Data, please contact Webmaster')
      }
    }
  }
}
</script>
<style lang="scss"></style>
