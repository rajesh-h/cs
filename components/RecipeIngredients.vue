<template>
  <v-row>
    <v-row
      v-for="(recipeIngredient, g_index) in recipeIngredients"
      :key="g_index"
      wrap
      justify-center
    >
      <v-col cols="12" sm="12" md="12" lg="12" xl="12" px-3>
        <v-text-field :value="recipeIngredient.group.name" label="Group Name" />
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" xl="12" px-3>
        <v-row
          v-for="(ingredient, s_index) in recipeIngredient.group.ingredients"
          :key="s_index"
          wrap
          justify-center
        >
          <v-col cols="5" sm="5" md="6" lg="6" xl="6" px-3>
            <v-text-field
              :value="ingredient.ingredient"
              :label="'Ingredient ' + (s_index + 1)"
            />
          </v-col>
          <v-col cols="5" sm="5" md="3" lg="3" xl="3" px-3>
            <v-text-field
              :value="ingredient.quantity"
              :label="'Quantity ' + (s_index + 1)"
            />
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="3" xl="3" px-3>
            <v-btn
              text
              small
              color="red"
              @click="removeIngredient(g_index, s_index)"
            >
              <v-icon dark>mdi-minus-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-btn text normal color="green" @click="addExtraIngredient(g_index)">
          <v-icon dark>mdi-plus-box</v-icon>ADD MORE
        </v-btn>
      </v-col>
    </v-row>
    <v-btn
      absolute
      right
      bottom
      small
      fab
      dark
      color="green"
      @click="addAdditionalIngredientGroup"
    >
      <v-icon dark>mdi-plus</v-icon>ADD GROUP
    </v-btn>
  </v-row>
</template>
<script>
export default {
  name: 'RecipeIngredients',
  props: {
    recipeIngredients: {
      type: Array,
      default() {
        return [
          {
            group: {
              name: '',
              ingredients: [
                { ingredient: '', quantity: '' },
                { ingredient: '', quantity: '' }
              ]
            }
          }
        ]
      }
    }
  },
  data: () => ({}),
  methods: {
    addAdditionalIngredientGroup() {
      this.recipeIngredients.push({
        group: {
          name: '',
          ingredients: [
            { ingredient: '', quantity: '' },
            { ingredient: '', quantity: '' }
          ]
        }
      })
    },
    removeIngredientGroup(index) {
      this.recipeIngredients.splice(index, 1)
    },
    addExtraIngredient(index) {
      this.recipeIngredients[index].group.ingredients.push({
        ingredient: '',
        quantity: ''
      })
    },
    removeIngredient(gIndex, sIndex) {
      this.recipeIngredients[gIndex].group.ingredients.splice(sIndex, 1)
    }
  }
}
</script>
