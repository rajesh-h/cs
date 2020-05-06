<template>
  <v-row wrap>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row wrap>
          <v-col cols="12" sm="12" md="8" lg="8" xl="8" px-3>
            <v-text-field
              v-model="recipeArray.title"
              :counter="150"
              :rules="textFieldRules"
              label="Title"
              required
            />
            <v-row wrap>
              <v-col cols="10" sm="10" md="10" lg="10" xl="10" px-3>
                <v-text-field
                  v-if="!editSlug"
                  v-model="createSlug"
                  :counter="150"
                  :rules="textFieldRules"
                  label="Slug"
                  :disabled="!editSlug"
                  placeholer="Auto Populate"
                />
                <v-text-field
                  v-if="editSlug"
                  v-model="recipeArray.slug"
                  :counter="150"
                  :rules="textFieldRules"
                  label="Slug"
                  placeholer="Auto Populate"
                />
              </v-col>
              <v-col cols="2" sm="2" md="2" lg="2" xl="2" px-3>
                <v-switch
                  v-model="editSlug"
                  class="mx-2"
                  label="Edit Slug"
                  color="green"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      >Intro Text</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <RecipeIntros
                        ref="recipeIntrosComponent"
                        :edit-page="editPage"
                        :recipe-intros="recipeArray.recipeIntros"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <br />

            <v-text-field
              v-model="recipeArray.youtubeUrl"
              label="YouTube Url"
            />
            <v-row wrap>
              <v-col cols="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field v-model="recipeArray.serves" label="Serves" />
              </v-col>
              <v-col cols="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field
                  v-model="recipeArray.prepTime"
                  label="Prep Time"
                />
              </v-col>
              <v-col cols="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field
                  v-model="recipeArray.cookTime"
                  label="Cook Time"
                />
              </v-col>
              <v-col cols="6" sm="6" md="3" lg="3" xl="3" px-3>
                <v-text-field
                  v-model="recipeArray.totalTime"
                  label="Total Time"
                />
              </v-col>
            </v-row>

            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Ingredients</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <RecipeIngredients
                    :recipe-ingredients="recipeArray.recipeIngredients"
                  />
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
                  <RecipeSteps
                    ref="recipeStepsComponent"
                    :edit-page="editPage"
                    :recipe-steps="recipeArray.recipeSteps"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <br />
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >Recipe Notes</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-textarea
                    v-model="recipeArray.recipeNotes"
                    label="Please Enter Recipe Notes"
                    auto-grow
                  ></v-textarea>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4" xl="4" px-3>
            <v-switch
              v-model="recipeArray.publish"
              label="Publish"
              color="green"
            ></v-switch>
            <h3>Featured Image</h3>

            <ImageUpload
              ref="imgUpload"
              :image-url="recipeArray.featuredImage"
              :edit-page="editPage"
              @imageUploaded="recipeArray.featuredImage = $event"
            />

            <br />
            <v-expansion-panels focusable>
              <v-expansion-panel>
                <v-expansion-panel-header>Categories</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row v-if="showCategories" wrap class="smallCheckBoxes">
                    <v-col
                      v-for="item in categoriesList.categories"
                      :key="item"
                      cols="12"
                      sm="12"
                      md="4"
                      lg="4"
                      xl="4"
                      class="pa-0 ma-0"
                    >
                      <v-checkbox
                        v-model="recipeArray.categories"
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
            <br />
            <v-switch
              v-model="recipeArray.featuredRecipe"
              label="Featured Recipe"
              color="green"
            ></v-switch>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >SEARCH KEYWORDS</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-text-field
                    v-model="postTag"
                    label="Please Enter Recipe Tags"
                    @keydown.enter="addTag(postTag)"
                  ></v-text-field>
                  <div>
                    <v-chip
                      v-for="(tag, tindex) in recipeArray.postTags"
                      :key="tindex"
                      outlined
                      class="ma-2"
                      @click="removeTag(tindex)"
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12" class="text-center">
            <!-- <v-btn :disabled="!valid" color="info" @click="validate">
              Validate
            </v-btn>

            <v-btn color="error" @click="reset">
              Reset Form
            </v-btn>

            <v-btn color="secondary" @click="resetValidation">
              Reset Validation
            </v-btn> -->
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
import ImageUpload from '@/components/ImageUpload'
import RecipeSteps from '@/components/RecipeSteps'
import RecipeIngredients from '@/components/RecipeIngredients'
import RecipeIntros from '@/components/RecipeIntros'
import { StoreDB } from '@/plugins/firebase'

export default {
  name: 'RecipeForm',
  components: {
    ImageUpload,
    RecipeSteps,
    RecipeIngredients,
    RecipeIntros
  },
  props: {
    editPage: {
      type: Boolean,
      default: false
    },
    editSlug: {
      type: Boolean,
      default: false
    },
    recipeArray: {
      type: Object,
      default() {
        return {
          title: '',
          slug: '',
          recipeIntros: [
            {
              text: '',
              imageUrl: ''
            }
          ],
          youtubeUrl: '',
          serves: '',
          prepTime: '',
          cookTime: '',
          totalTime: '',
          recipeIngredients: [
            {
              group: {
                name: '',
                ingredients: [
                  { ingredient: '', quantity: '' },
                  { ingredient: '', quantity: '' }
                ]
              }
            }
          ],
          recipeSteps: [
            {
              group: {
                name: '',
                steps: [
                  { text: '', stepImageUrl: '' },
                  { text: '', stepImageUrl: '' }
                ]
              }
            }
          ],
          recipeNotes: '',
          publish: false,
          featuredRecipe: false,
          featuredImage: '',
          categories: [],
          postTags: [],
          created: '',
          updated: '',
          author: 'Yaman Agarwal'
        }
      }
    }
  },
  data: () => ({
    postTag: '',
    pageTitle: 'Recipes',
    valid: true,
    categoriesList: [],
    showCategories: false,
    textFieldRules: [
      (v) => !!v || 'Required',
      (v) => (v && v.length <= 150) || 'Must be less than 150 characters'
    ]
  }),
  computed: {
    createSlug() {
      if (!this.editSlug && this.recipeArray.title) {
        return this.recipeArray.title
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-')
      } else {
        return this.recipeArray.slug
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
      // Reset Steps images
      this.$refs.recipeIntrosComponent.resetImageUploadOnsteps()
      this.$refs.recipeStepsComponent.resetImageUploadOnsteps()
      this.$refs.imgUpload.resetImageUpload()
      this.recipeArray = {
        title: '',
        slug: '',
        recipeIntros: [
          {
            text: '',
            imageUrl: ''
          }
        ],
        serves: '',
        prepTime: '',
        cookTime: '',
        totalTime: '',
        recipeIngredients: [
          {
            group: {
              name: '',
              ingredients: [
                { ingredient: '', quantity: '' },
                { ingredient: '', quantity: '' }
              ]
            }
          }
        ],
        recipeSteps: [
          {
            group: {
              name: '',
              steps: [
                { text: '', stepImageUrl: '' },
                { text: '', stepImageUrl: '' }
              ]
            }
          }
        ],
        recipeNotes: '',
        publish: false,
        featuredRecipe: false,
        featuredImage: '',
        categories: [],
        postTags: [],
        created: '',
        updated: '',
        author: 'Yaman Agarwal'
      }
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    ...mapActions({
      addRecipe: 'recipes/addRecipe',
      editRecipe: 'recipes/editRecipe'
    }),
    onSubmit(e) {
      if (this.$refs.form.validate()) {
        if (!this.editSlug) {
          this.recipeArray.slug = this.createSlug
        }
        if (!this.recipeArray.created) {
          this.recipeArray.created = Date.now()
        }
        this.recipeArray.updated = Date.now()
        e.preventDefault()
        // eslint-disable-next-line no-console
        // console.log(this.recipeArray)
        // this.addRecipe(this.recipeArray)
        if (!this.recipeArray.id) {
          this.addRecipe(this.recipeArray)
        } else {
          this.editRecipe(this.recipeArray)
        }
        // eslint-disable-next-line no-console
        // console.log(this.recipeArray)
        // this.reset()
      }
    },
    addTag(tag) {
      this.recipeArray.postTags.push(tag)
      this.postTag = ''
    },
    removeTag(idx) {
      this.recipeArray.postTags.splice(idx)
    }
  }
}
</script>

<style></style>
