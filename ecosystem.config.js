module.exports = {
  apps: [
    {
      name: 'nuxt-prod',
      script: 'yarn',
      args: 'start',
      interpreter: '/bin/bash',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
