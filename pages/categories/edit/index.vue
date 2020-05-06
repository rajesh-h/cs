<template>
  <v-container>
    <v-row>
      <v-col cols="8"
        >Edit Categories -- Click Update to changes to take effect</v-col
      >
      <v-col cols="2">
        <v-btn block color="primary" class="ml-4" @click="updateCategory">
          UPDATE
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn class="primary" @click="gotoAdmin">GO TO ADMIN</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="newCategory"
          label="New category"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-btn color="primary" class="ml-4" @click="addCategory">
          ADD
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(category, index) in categories" :key="index" cols="3">
        <p>
          {{ category }}
          <v-icon right @click="removeCategory(index)"
            >mdi-delete-forever</v-icon
          >
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  async fetch({ store }) {
    await store.dispatch('recipes/fetchCategories')
  },
  data() {
    return {
      newCategory: ''
    }
  },
  computed: {
    ...mapGetters({
      categories: 'recipes/categories'
    })
  },
  methods: {
    ...mapMutations({
      removeCat: 'recipes/removeCategory',
      addCat: 'recipes/addCategory'
    }),
    ...mapActions({
      updateCat: 'recipes/updateCategories'
    }),
    removeCategory(idx) {
      this.removeCat(idx)
    },
    addCategory() {
      if (this.newCategory) {
        this.addCat(this.newCategory)
        this.newCategory = ''
      } else {
        alert('Please enter a category ')
      }
    },
    updateCategory() {
      this.updateCat()
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
