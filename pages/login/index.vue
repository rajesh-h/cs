<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="6">
            <v-form @submit.prevent="login" @submit.enter="login">
              <h1>Login</h1>
              <v-text-field
                v-model="account.email"
                label="Email:"
                type="email"
                :rules="[required('Email')]"
              />
              <v-text-field
                v-model="account.password"
                type="password"
                label="Password"
                :rules="[required('Password')]"
              />
              <div class="form-group">
                <input type="submit" class="primary pa-2" @click="login" />
              </div>
              <div v-if="isError" class="alert alert-danger">
                <p class="mb-0">{{ errMsg }}</p>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      account: {
        email: '',
        password: ''
      },
      isError: false,
      errMsg: '',

      required(field) {
        return (v) => (v && v.length > 0) || `You must input a ${field}`
      },
      maxLength(field, maxLength) {
        return (v) =>
          (v && v.length > maxLength) ||
          `${field} must be less then ${maxLength} characters`
      }
    }
  },
  methods: {
    login(e) {
      e.preventDefault()
      // TODO: add parsing of data.
      this.$store
        .dispatch('users/login', this.account)
        .then(() => {
          this.$router.push('/admin')
        })
        .catch((error) => {
          this.isError = true
          this.errMsg = error.code
          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
    }
  }
}
</script>

<style></style>
