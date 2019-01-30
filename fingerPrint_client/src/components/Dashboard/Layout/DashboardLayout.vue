<template>
  <div id ="door" class="wrapper">
      <top-navbar></top-navbar>
      <dashboard-content>
      </dashboard-content>

    <!-- <content-footer></content-footer>     -->
</div>
</template>

<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    }
  }

</script>

<style>
  wrapper {
    background-color: #f6f6f6;
  }
</style>