<template>
  <header class="clearfix">
			<div class="title">
				<h1><router-link class="linkname" :to="{path:'/admin/home'}">Door Access Control Search</router-link></h1>
				<h2>Door Access Control Search System Based on Blockchain</h2>
			</div>
			<div class="search">

				<input class="search_input" type="text"
               placeholder="Search by your Access ID"
               @keyup.enter="clickPropsCheck($event)"
               v-model.trim="doorAccessId"
               >
				<img class="search-img img-margin" :src="door_search" alt="search" v-on:click="clickPropsCheck($event)">

        <br>
        <br>        
         <b-alert :show="dismissCountDown"
             dismissible
             variant="warning"
             @dismissed="dismissCountDown=0"             
             >
            {{ alertText }}
          </b-alert>

			</div>

		</header>
</template>


<script>  
  import axios from 'axios'
  import door_search from '@/assets/static/images/door_search.png'

  export default {    
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
        localUrl: this.localUrl,
        door_search: door_search,
        dismissSecs: 2,
        dismissCountDown: 0,
        alertText: '',
        type: ['', 'info', 'success', 'warning', 'danger'],
        notifications: {
          topCenter: false
        },
        alert: true,
        doorAccessId: '',
        activeNotifications: false
      }
    },
    created: function () {
      // data 영역
      // this.getSpeedSearchResult();                      
    },
    methods: {      
      notifyVue1 (verticalAlign, horizontalAlign) {
        this.dismissCountDown = this.dismissSecs
        this.alertText = 'Unrecognized search pattern. Please try entering stream transaction Id!';

      },
      notifyVue2 (verticalAlign, horizontalAlign) {
        this.dismissCountDown = this.dismissSecs
        this.alertText = 'No matching records found.';

      },
      clickPropsCheck: function(event) {
        var hashValue = this.doorAccessId;
        if(hashValue.length !== 64) {
          this.notifyVue1('top', 'right');
        } else {
          this.getFingerPrintSearchResult();
        }
        this.doorAccessId = "";
      },
      getFingerPrintSearchResult: function () {
        var _self = this;
        var checkValue = 0;
        var paramValue = this.doorAccessId;
        axios.get('http://'+this.localUrl+':8081/v1/search/fingerprints/'+paramValue
        , { headers: { 'Access-Control-Allow-Origin': true }})
        .then(function (response) {
        _self.$router.push( { path : '/admin/doorAccess/'+paramValue });                 

        })
        .catch(function (error) {
          if(error.response.status === 400){
             _self.notifyVue2('top', 'right');
          } else {
             console.log('an error occured.'+error); 
          }          
        })
      },
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      }
    }
  }

</script>

<style scoped>
  .linkname {
    color: white;
  }
  .navbar .navbar-brand{
      margin-right:200px
  }
  .mr-sm-2{
    width: 600px    
  }

  .search_input{
    background-color:white;
  }

  .img-margin {
    margin-right: 25px
  }
  
</style>
