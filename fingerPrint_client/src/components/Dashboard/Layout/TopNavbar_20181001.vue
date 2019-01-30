<template>
<div id="app">
  <v-toolbar
    absolute
        color="red lighten-2"   
        dark     
        scroll-off-screen
        scroll-target="#scrolling-techniques"        
        height="100px"
  >    
    <v-toolbar-title>          
          <router-link :to="{path:'/admin/home'}">Door Access Control Search</router-link><br>
          <p>Door Access Control Search System Based on Blockchain</p>
        </v-toolbar-title>
    <v-spacer></v-spacer>
    
        <v-text-field
            label="Search by your Access ID"
            append-icon="search"            
            @keyup.enter="clickPropsCheck($event)"            
            v-model.trim="doorAccessId" 
          ></v-text-field>


  </v-toolbar>      
</div>
</template>
<script>  
  import axios from 'axios'

  export default {    
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
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
          const notification = {
          template: `<span>Unrecognized search pattern. </br> Please try searching for a transaction by entering stream transaction Id!</span>`
          }                           
        
        const color = Math.floor((Math.random() * 4) + 1)        
        this.$notifications.notify(
          {
            component: notification,
            icon: 'nc-icon nc-app',
            horizontalAlign: horizontalAlign,
            verticalAlign: verticalAlign,
            type: this.type[4]
          })        
      },
      notifyVue2 (verticalAlign, horizontalAlign) {              
          const notification = {
          template: `<span>No matching records found.</span>`
          } 

        const color = Math.floor((Math.random() * 4) + 1)        
        this.$notifications.notify(
          {
            component: notification,
            icon: 'nc-icon nc-app',
            horizontalAlign: horizontalAlign,
            verticalAlign: verticalAlign,
            type: this.type[4]
          })        
      },
      clickPropsCheck: function(event) {
        var hashValue = this.doorAccessId;
        if(hashValue.length !== 64) {
          this.notifyVue1('top', 'right');
        } else {
          this.getFingerPrintSearchResult();
        }

        //alert('hashValue :'+hashValue);
        // if(!hashValue){
        //   alert('No Search input!');
        // } else {
        //   if(hashValue.length !== 64) {
        //     alert(' Unrecognized search pattern. Please try searching for a transaction by entering stream transaction Id! ');
        //   } else {
        //     this.getFingerPrintSearchResult();
        //   }
        // }
        this.doorAccessId = "";
      },
      getFingerPrintSearchResult: function () {
        var _self = this;
        var checkValue = 0;
        var paramValue = this.doorAccessId;
        axios.get('http://localhost:8081/v1/search/fingerprints/'+paramValue
        , { headers: { 'Access-Control-Allow-Origin': true }})
        .then(function (response) {
        // push
        _self.$router.push( { path : '/admin/doorAccess/'+paramValue });                 

        })
        .catch(function (error) {
          console.log(error.response);
          if(error.response.status === 400){

             _self.notifyVue2('top', 'right');
             //alert('No matching records found.');

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
<style>
  .navbar .navbar-brand{
      margin-right:200px
  }
  .mr-sm-2{
    width: 600px    
  }
  
</style>
