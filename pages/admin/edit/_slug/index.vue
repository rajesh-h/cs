<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row justify="space-between" align="center">
          <v-col cols="3">
            <div>
              <h3>
                EDIT RECIPE
              </h3>
            </div>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-row>
              <v-col>
                <v-btn class="primary" @click="gotoAdmin">GO TO ADMIN</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <RecipeForm
      :recipe-array="recipeArray"
      :edit-slug="editSlug"
      :edit-page="true"
    />
  </v-container>
</template>

<script>
import moment from 'moment'
import RecipeForm from '@/components/RecipeForm'
import { StoreDB } from '@/plugins/firebase'
export default {
  name: 'EditRecipe',
  pageTitle: 'EDIT RECIPE',
  components: {
    RecipeForm
  },
  data: () => ({
    recipeArray: {},
    loading: true,
    editSlug: false
  }),
  created() {
    // eslint-disable-next-line no-console
    // console.log(this.$route.params)
    this.fetchRecipeDetail(this.$route.params.slug)
  },
  mounted() {
    this.loading = false
  },
  methods: {
    async fetchRecipeDetail(slug) {
      const requestedPost = []

      return await StoreDB.collection('recipes')
        .where('slug', '==', slug)
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // eslint-disable-next-line no-console
            console.log('Query empty')
            alert('Requested Recipe Not Found')
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
            this.recipeArray = requestedPost[0]
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log('Something went wrong here, Enable Debug')
          // make sure to change catch method to add (e) for debug .catch((e) => {
          // eslint-disable-next-line no-console
          // console.log(e)
        })
    },
    gotoAdmin() {
      this.$router.push({
        name: 'admin'
      })
    }
  }
}
</script>

<style></style>
