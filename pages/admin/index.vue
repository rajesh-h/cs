<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row justify="space-between" align="center">
          <v-col cols="3">
            <div>
              <h3>
                DASHBOARD
              </h3>
            </div>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-row>
              <v-col>
                <v-btn class="primary" @click="editCategory"
                  >Edit Category</v-btn
                >
              </v-col>
              <v-col>
                <v-btn class="primary" @click="newRecipe">Add New</v-btn>
              </v-col>
              <v-col>
                <v-btn class="error" @click="logout">Logout</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <div>
              <v-data-table
                :headers="headers"
                :items="dashBoardRecipes"
                class="elevation-1"
              >
                <template v-slot:item.featuredImage="{ item }">
                  <v-img
                    :src="item.featuredImage"
                    style="width: 50px; height: auto"
                  ></v-img>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-icon small @click="editItem(item.slug, item.id)">
                    mdi-pen
                  </v-icon>
                  <!-- <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon> -->
                </template>
              </v-data-table>
            </div>
            <div class="my-2 text-right">
              <v-btn @click="fetchMoreRecipes">Fetch More</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  async fetch({ store }) {
    const payload = { forDashboard: true, limit: 10 }
    await store.dispatch('recipes/fetchList', payload)
  },
  data() {
    return {
      isError: false,
      errMsg: '',
      loading: true,
      headers: [
        {
          text: 'Image',
          align: 'left',
          sortable: false,
          value: 'featuredImage'
        },
        { text: 'Title', value: 'title', align: 'left' },
        { text: 'Updated', value: 'updatedFmt' },
        { text: 'Published', value: 'publish' },
        { text: 'Actions', value: 'action', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters({
      dashBoardRecipes: 'recipes/list'
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
  methods: {
    logout(e) {
      e.preventDefault()
      // TODO: add parsing of data.
      this.$store
        .dispatch('users/logout')
        .then(() => {
          this.$router.push('/login')
        })
        .catch((error) => {
          this.isError = true
          this.errMsg = error.code
          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
    },
    ...mapActions({
      fetchMore: 'recipes/appendList'
    }),
    fetchMoreRecipes() {
      this.fetchMore({ forDashboard: true, limit: 10 })
    },
    editItem(slug, id) {
      this.$router.push({
        name: 'admin-edit-slug',
        params: { slug, id }
      })
    },
    newRecipe() {
      this.$router.push({ name: 'admin-add' })
    },
    editCategory() {
      this.$router.push({
        name: 'categories-edit'
      })
    }
  }
}
</script>

<style></style>
