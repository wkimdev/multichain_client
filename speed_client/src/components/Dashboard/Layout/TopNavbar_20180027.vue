<template>
  <div id="app">
  <v-toolbar
    absolute
        color="blue"   
        dark     
        scroll-off-screen
        scroll-target="#scrolling-techniques"        
        height="100px"
  >    
    <v-toolbar-title>
          <!-- <a href="">Door Access Control Search</a><br> -->
          <router-link :to="{path:'/admin/home'}">Speeding Search</router-link><br>
          <p>Speed Limit Violation Search System Based on Blockchain</p>
        </v-toolbar-title>
    <v-spacer></v-spacer>
    
        <v-text-field
            label="Search by your Speeding ID"
            append-icon="search"            
            @keyup.enter="clickPropsCheck($event)"            
            v-model.trim="streamId" 
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
        streamId: '',
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
        var hashValue = this.streamId;
        if(hashValue.length !== 64) {
          this.notifyVue1('top', 'right');
        } else {
          this.getSpeedSearchResult();
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
        this.streamId = "";
      },
      getSpeedSearchResult: function () {
        var _self = this;
        var checkValue = 0;
        var paramValue = this.streamId;
        axios.get('http://localhost:8081/v1/search/speeds/'+paramValue
        , { headers: { 'Access-Control-Allow-Origin': true }})
        .then(function (response) {              
        // push
        _self.$router.push( { path : '/admin/speedings/'+paramValue });                 

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
<style>  
  .navbar .navbar-brand{
    margin-right:200px
  }
  .mr-sm-2{
    width: 600px    
  }
  
</style>
