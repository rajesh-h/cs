<template>
  <v-row>
    <v-col cols="12">
      <v-row v-for="(intro, index) in recipeIntros" :key="index">
        <v-col cols="12" sm="12" md="12" lg="12" xl="12" px-3>
          <v-textarea
            v-model="intro.text"
            filled
            label="Please Enter Intro Text"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-row justify="space-between">
          <v-col cols="3">
            <ImageUpload
              ref="introImgUpload"
              :image-url="intro.imageUrl"
              :edit-page="editPage"
              @imageUploaded="intro.imageUrl = $event"
            />
          </v-col>
          <v-col cols="3">
            <v-btn text small color="red" @click="removeIntro(index)">
              <v-icon dark>mdi-minus-box</v-icon>REMOVE INTRO
            </v-btn>
          </v-col>
        </v-row>
      </v-row>

      <v-btn
        absolute
        right
        bottom
        small
        fab
        dark
        color="green"
        @click="addIntro"
      >
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import ImageUpload from '@/components/ImageUpload'

export default {
  name: 'RecipeIntros',
  components: {
    ImageUpload
  },
  props: {
    editPage: {
      type: Boolean,
      default: false
    },
    recipeIntros: {
      type: Array,
      default() {
        return [
          {
            text: '',
            imageUrl: ''
          }
        ]
      }
    }
  },
  data: () => ({}),
  methods: {
    addIntro() {
      this.recipeIntros.push({
        text: '',
        imageUrl: ''
      })
    },
    removeIntro(index) {
      this.recipeIntros.splice(index, 1)
    },
    resetImageUploadOnIntros() {
      this.recipeIntros.forEach((intro, index) => {
        this.$refs.introImgUpload[index].resetImageUpload()
      })
    }
  }
}
</script>
