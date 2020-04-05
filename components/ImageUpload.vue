<template>
  <v-row>
    <v-col>
      <v-btn
        v-if="!uploadEnd && !uploading && !imageUrl"
        small
        text
        color="green"
        @click.native="selectFile"
      >
        <v-icon dark>mdi-upload</v-icon>UPLOAD IMAGE
      </v-btn>

      <input
        id="files"
        ref="uploadInput"
        type="file"
        name="file"
        accept="image/*"
        style="display: none"
        :multiple="false"
        @change="detectFiles($event)"
      />

      <v-progress-circular
        v-if="uploading && !uploadEnd"
        :size="100"
        :width="15"
        :rotate="360"
        :value="progressUpload"
        color="primary"
      >
        {{ progressUpload }}%
      </v-progress-circular>
      <v-row align="center" fill-height wrap>
        <v-col xs="9" sm="9" md="9" lg="9" xl="9" px-3>
          <v-img
            v-if="uploadEnd || editPage"
            :src="imageUrl"
            width="100%"
          ></v-img>
        </v-col>
        <v-col xs="3" sm="3" md="3" lg="3" xl="3" px-3>
          <div v-if="uploadEnd || editPage" mb-4>
            <v-btn text icon small color="red" @click="deleteImage()">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import { firestorage } from '@/plugins/firebase'

export default {
  name: 'ImageUpload',
  props: {
    // uploadEnd: {
    //   type: Boolean,
    //   default: false
    // },
    editPage: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    }
    // uploading: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data: () => ({
    progressUpload: 0,
    fileName: '',
    uploadTask: '',
    uploading: false,
    uploadEnd: false,
    imageUrlAfterUpload: '',
    uploadEndAfterUpload: false
  }),

  watch: {
    uploadTask() {
      this.uploadTask.on(
        'state_changed',
        (sp) => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          )
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.uploadEnd = true
            this.imageUrlAfterUpload = downloadURL
            this.$emit('imageUploaded', this.imageUrlAfterUpload)
          })
        }
      )
    }
  },
  methods: {
    selectFile() {
      this.$refs.uploadInput.click()
    },
    detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map((x) => {
        this.upload(fileList[x])
      })
    },
    upload(file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = firestorage.ref('content/' + file.name).put(file)
    },
    deleteImage() {
      firestorage
        .ref('content/' + this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.imageUrlAfterUpload = ''
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(`file delete error occured: ${error}`)
        })
      // this.$refs.form.reset()
    },
    resetImageUpload() {
      this.uploading = false
      this.uploadEnd = false
    }
  }
}
</script>
