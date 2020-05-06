<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row justify="space-between" align="center">
          <v-col cols="3">
            <div>
              <h3>
                ADD RECIPE
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
    <RecipeForm />
  </v-container>
</template>

<script>
import RecipeForm from '@/components/RecipeForm'
export default {
  name: 'AddRecipe',
  pageTitle: 'ADD RECIPE',
  components: {
    RecipeForm
  },
  methods: {
    gotoAdmin() {
      this.$router.push({
        name: 'admin'
      })
    }
  }
}
</script>

<style></style>
