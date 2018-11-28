<template lang="pug">
  #app
    link(rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous")
    .hero.is-primary
      .hero-body
        .container
          h1.title Flugsuche
            |
            i.fas.fa-plane
            span.is-pulled-right(style="font-size: 1.8rem;")
              i.far.fa-bell
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
