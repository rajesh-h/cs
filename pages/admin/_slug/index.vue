<template>
  <v-row wrap>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row wrap>
          <v-col xs="12" sm="12" md="8" lg="8" xl="8" px-3>
            <v-text-field
              v-model="title"
              :counter="150"
              :rules="titleRules"
              label="Title"
              required
            />
            <v-text-field
              :value="createSlug"
              :counter="150"
              :rules="titleRules"
              label="Slug"
              :disabled="!editSlug"
              placeholer="Auto Populate"
            />
            <v-textarea
              v-model="content"
              filled
              label="Please enter Main Description/Content"
              auto-grow
            ></v-textarea>
            <v-row wrap>
              <v-col xs="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field v-model="servings" label="Servings" />
              </v-col>
              <v-col xs="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field v-model="prepTime" label="Prep Time" />
              </v-col>
              <v-col xs="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field v-model="cookTime" label="Cook Time" />
              </v-col>
              <v-col xs="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field v-model="totalTime" label="Total Time" />
              </v-col>
            </v-row>

            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Ingredients</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row
                    v-for="(ingredient, index) in ingredients"
                    :key="index"
                    wrap
                    justify-center
                  >
                    <v-col xs="12" sm="9" md="9" lg="9" xl="9" px-3>
                      <v-text-field
                        v-model="ingredients[index]"
                        :counter="200"
                        :label="'Ingredient ' + (index + 1)"
                        required
                      />
                    </v-col>

                    <v-btn
                      right
                      x-small
                      dark
                      color="red"
                      @click="removeIngredient(index)"
                    >
                      <v-icon dark>mdi-minus</v-icon>
                    </v-btn>
                  </v-row>
                  <v-btn
                    absolute
                    right
                    small
                    fab
                    dark
                    color="green"
                    @click="addExtraIngredient"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <br />
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >Steps Involved</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-row
                    v-for="(step, index) in steps"
                    :key="index"
                    wrap
                    justify-center
                  >
                    <v-col xs="12" sm="9" md="9" lg="9" xl="9" px-3>
                      <v-textarea
                        v-model="steps[index].text"
                        rows="3"
                        filled
                        :label="'Step ' + (index + 1)"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                    <v-col
                      align-self="center"
                      xs="12"
                      sm="3"
                      md="3"
                      lg="3"
                      xl="3"
                      px-3
                      class="text-xs-center"
                    >
                      <ImageUpload
                        :image-url="steps[index].stepImageUrl"
                        @imageUploaded="steps[index].stepImageUrl = $event"
                      />
                      <v-btn
                        right
                        x-small
                        dark
                        color="red"
                        @click="removeStep(index)"
                      >
                        <v-icon dark>mdi-minus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-btn
                    absolute
                    right
                    small
                    fab
                    dark
                    color="green"
                    @click="addExtraStep"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <br />
            <v-textarea
              v-model="recipeNotes"
              filled
              label="Please Enter Recipe Notes"
              auto-grow
            ></v-textarea>

            <!-- <no-ssr placeholder="Loading Your Editor...">
              <vue-editor
                id="editor"
                v-model="content"
                placeholder="Write Something..."
                use-custom-image-handler
                @imageRemoved="handleImageRemoved"
                @imageAdded="handleImageAdded"
              >
              </vue-editor>
            </no-ssr> -->
          </v-col>
          <v-col xs="12" sm="12" md="4" lg="4" xl="4" px-3>
            <v-switch v-model="publish" label="Publish"></v-switch>
            <h3>Featured Image</h3>

            <ImageUpload
              ref="imgUpload"
              :image-url="featuredImageUrl"
              @imageUploaded="featuredImageUrl = $event"
            />

            <!-- <v-select
              v-model="categories"
              class="mt-5"
              :items="categoriesData.categories"
              label="Categories"
              multiple
            ></v-select> -->
            <br />
            <v-expansion-panels focusable>
              <v-expansion-panel>
                <v-expansion-panel-header>Categories</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row v-if="showCategories" wrap class="smallCheckBoxes">
                    <v-col
                      v-for="item in categoriesList.categories"
                      :key="item"
                      xs="12"
                      sm="12"
                      md="4"
                      lg="4"
                      xl="4"
                      class="pa-0 ma-0"
                    >
                      <v-checkbox
                        v-model="categories"
                        class="smallCheckBoxes pa-0 ma-0"
                        style="font-size:10px;"
                        dense
                        :label="item"
                        :value="item"
                        color="green"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col xs="12" class="text-center">
            <v-btn :disabled="!valid" color="info" @click="validate">
              Validate
            </v-btn>

            <v-btn color="error" @click="reset">
              Reset Form
            </v-btn>

            <v-btn color="secondary" @click="resetValidation">
              Reset Validation
            </v-btn>
            <v-btn color="primary" @click="onSubmit">
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
// import { fetchCategories } from '@/services/functions'
import ImageUpload from '@/components/ImageUpload'
import { StoreDB } from '@/services/fireinit.js'

// const getCategories = () =>
//   import('~/data/categories.json').then((m) => m.default || m)

export default {
  name: 'AddEditRecipe',
  pageTitle: 'ADD RECIPE',
  components: {
    ImageUpload
  },

  async asyncData({ req }) {
    // const categoriesData = await getCategories()
    // // eslint-disable-next-line no-console
    // // console.log(categoriesData)
    // return { categoriesData }
  },

  data: () => ({
    pageTitle: 'Recipes',
    valid: true,
    title: '',
    slug: '',
    image: '',
    publish: false,
    content: '',
    titleRules: [
      (v) => !!v || 'Required',
      (v) => (v && v.length <= 150) || 'Must be less than 150 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'Required',
      (v) => /.+@.+/.test(v) || 'Must be valid'
    ],
    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    checkbox: false,
    dataArray: {},
    categoriesList: [],
    categories: [],
    ingredients: ['', ''],
    featured_image: '',
    showCategories: false,
    featuredImageUrl: '',
    featuredImageUrl2: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    recipeNotes: '',
    steps: [
      { text: '', stepImageUrl: '' },
      { text: '', stepImageUrl: '' }
    ],
    editSlug: false
  }),
  computed: {
    createSlug() {
      if (!this.editSlug) {
        if (this.title) {
          return this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  async mounted() {
    // eslint-disable-next-line no-console
    await StoreDB.collection('categories')
      .doc('categories')
      .get()
      .then((res) => {
        // eslint-disable-next-line no-console
        this.categoriesList = res.data()
        this.showCategories = true
      })
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
    reset() {
      // this.slug = ''
      this.featuredImageUrl = ''
      // this.content = ''
      this.recipeNotes = ''
      this.steps = [
        { name: 'Step 1', text: '', stepImageUrl: '' },
        { name: 'Step 2', text: '', stepImageUrl: '' }
      ]
      this.ingredients = ['', '']
      this.$refs.imgUpload.resetImageUpload()
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    ...mapActions({
      addRecipe: 'recipes/addRecipe'
    }),
    onSubmit(e) {
      if (this.$refs.form.validate()) {
        // eslint-disable-next-line no-console
        // console.log(this.title)
        this.dataArray = {
          title: this.title,
          slug: this.createSlug,
          publish: this.publish,
          created: new Date(),
          updated: new Date(),
          categories: this.categories,
          ingredients: this.ingredients,
          servings: this.servings,
          prepTime: this.prepTime,
          cookTime: this.cookTime,
          totalTime: this.totalTime,
          featured_image: this.featuredImageUrl,
          content: this.content,
          steps: this.steps,
          recipeNotes: this.recipeNotes
        }
        e.preventDefault()
        this.addRecipe(this.dataArray)
        // eslint-disable-next-line no-console
        console.log(this.dataArray)
        this.reset()
      }
    },
    addExtraStep() {
      this.steps.push({ text: '', stepImageUrl: '' })
    },
    removeStep(index) {
      this.steps.splice(index, 1)
    },
    addExtraIngredient() {
      this.ingredients.push('')
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1)
    }

    // getDataFromChild(param1, param2) {
    //   // eslint-disable-next-line no-console
    //   console.log('Calling from child component')
    //   // eslint-disable-next-line no-console
    //   console.log(param1)
    //   this.featuredImageUrl = param1
    //   this.featuredImageUploadEnd = param2
    // }
  }
}
</script>

<style scoped></style>
