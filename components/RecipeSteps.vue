<template>
  <v-row>
    <v-col>
      <v-row
        v-for="(recipeStep, g_index) in recipeSteps"
        :key="g_index"
        wrap
        justify-center
      >
        <v-col cols="12" sm="12" md="12" lg="12" xl="12" px-3>
          <v-text-field :value="recipeStep.group.name" label="Group Name" />
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="12" xl="12" px-3>
          <v-row
            v-for="(step, s_index) in recipeStep.group.steps"
            :key="s_index"
            wrap
            justify-center
          >
            <v-col cols="12" sm="9" md="9" lg="9" xl="9" px-3>
              <v-textarea
                :value="step.text"
                rows="3"
                filled
                :label="'Step ' + (s_index + 1)"
                auto-grow
              ></v-textarea>
              <v-btn
                text
                x-small
                color="red"
                @click="removeStep(g_index, s_index)"
              >
                <v-icon dark>mdi-minus-box</v-icon>REMOVE ABOVE STEP
              </v-btn>
            </v-col>
            <v-col
              align-self="center"
              cols="12"
              sm="3"
              md="3"
              lg="3"
              xl="3"
              px-3
              class="text-xs-center"
            >
              <ImageUpload
                ref="stepImgUpload"
                :image-url="step.stepImageUrl"
                :edit-page="editPage"
                @imageUploaded="step.stepImageUrl = $event"
              />
            </v-col>
          </v-row>
          <v-btn text normal color="green" @click="addExtraStep(g_index)">
            <v-icon dark>mdi-plus-box</v-icon>ADD MORE STEP
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
        @click="addAdditionalStepGroup"
      >
        <v-icon dark>mdi-plus</v-icon>ADD GROUP
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
import ImageUpload from '@/components/ImageUpload'
export default {
  name: 'RecipeSteps',
  components: {
    ImageUpload
  },
  props: {
    editPage: {
      type: Boolean,
      default: false
    },
    recipeSteps: {
      type: Array,
      default() {
        return [
          {
            group: {
              name: '',
              steps: [
                { text: '', stepImageUrl: '' },
                { text: '', stepImageUrl: '' }
              ]
            }
          }
        ]
      }
    }
  },
  data: () => ({}),
  methods: {
    addAdditionalStepGroup() {
      this.recipeSteps.push({
        group: {
          name: '',
          steps: [
            { text: '', stepImageUrl: '' },
            { text: '', stepImageUrl: '' }
          ]
        }
      })
    },
    removeStepGroup(index) {
      this.recipeSteps.splice(index, 1)
    },
    addExtraStep(index) {
      this.recipeSteps[index].group.steps.push({ text: '', stepImageUrl: '' })
    },
    removeStep(gIndex, sIndex) {
      this.recipeSteps[gIndex].group.steps.splice(sIndex, 1)
    },
    resetImageUploadOnsteps() {
      this.recipeSteps.forEach((rstep, idx) => {
        rstep.group.steps.forEach((step, index) => {
          this.$refs.stepImgUpload[index].resetImageUpload()
        })
      })
    }
  }
}
</script>
