<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <div class="hidden-md-and-up pa-2 text-right">
        <v-fab-transition>
          <v-btn fab small @click.stop="drawer = !drawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-tools">
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>

          <v-list-item>
            <v-list-item-action> </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Go Dark </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                v-model="isDark"
                color="grey"
                @change="toggleTheme"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <router-link to="/" class="toolbar-title"
          ><v-img :src="require('~/static/logo.png')"></v-img
        ></router-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; CookingShooking {{ new Date().getFullYear() }} </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isDark: this.$vuetify.theme.dark,
      clipped: true,
      drawer: null,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-chef-hat',
          title: 'About',
          to: '/about'
        },
        {
          icon: 'mdi-bookmark-multiple',
          title: 'Bookmarks',
          to: '/bookmarks'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {},
  mounted() {
    const theme = localStorage.getItem('useDarkTheme')
    if (theme) {
      if (theme === 'true') {
        this.$vuetify.theme.dark = true
      } else this.$vuetify.theme.dark = false
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('useDarkTheme', this.$vuetify.theme.dark.toString())
    }
  }
}
</script>
<style lang="scss"></style>
