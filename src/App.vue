<template lang="pug">
  #app
    link(rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous")
    link(rel="stylesheet" href="//cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css")
    router-view
    button.button.btn-back-to-top.is-primary.is-warning.is-rounded(v-show="hasScrolledDown && (isTabletSize || isPhoneSize)" @click="scrollTop")
      span.icon
        i.fas.fa-long-arrow-alt-up
      | Nach Oben
    footer.footer
      p &copy; 2019 Maximilian Vollstädt
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      isTabletSize: false,
      isPhoneSize: false,
      isDesktopSize: false,

      SIZE_PHONE: 768,
      SIZE_TABLET: 1024,

      hasScrolledDown: false,
    };
  },

  methods: {
    onResize(event) {
      // is tablet size
      if (event.target.innerWidth <= this.SIZE_TABLET && event.target.innerWidth > this.SIZE_PHONE) {
        this.isTabletSize = true;
        this.isPhoneSize = false;
      }
      // is phone size
      else if (event.target.innerWidth <= this.SIZE_PHONE) {
        this.isTabletSize = false;
        this.isPhoneSize = true;
      }
      // is desktop size
      else {
        this.isPhoneSize = false;
        this.isTabletSize = false;
      }
    },

    scrollTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },

    handleScroll() {
      this.hasScrolledDown = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20);
    },
  },

  computed: {
  },

  mounted() {
    // listen to scroll events
    window.addEventListener('scroll', this.handleScroll);
    // register event listeners for resize event
    window.addEventListener('resize', this.onResize);
    window.dispatchEvent(new Event('resize'));
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.handleScroll);
  },

};

</script>

<style lang="sass">
html
  scroll-behavior: smooth
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

.btn-back-to-top
  position: fixed
  bottom: 20px
  right: 20px
  .icon
    padding-right: 5px
</style>
