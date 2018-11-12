<template lang="pug">
  #app
    .hero.is-primary
      .hero-body
        .container
          h1.title Flugsuche
          h2.subtitle Finde den passenden Flug
    router-view
</template>

<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

#nav
  padding: 30px
  a
    font-weight: bold
    color: #2c3e50
    &.router-link-exact-active
      color: #42b983
</style>
