<template>
  <div class="content">
    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 style="margin-top:100px;">
              <v-card>              
              </v-card>
            </v-flex>
            
            <v-flex d-flex xs12 sm6>
              <v-layout row wrap>
                <v-flex d-flex>                  
                  <v-card color="grey lighten-2">                    
                    <v-card-text>
                       <h3>Today’s Speedings  {{ speedBlockCnt }} </h3>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex d-flex>                  
                  <v-card color="white">                    
                    <template slot="header">
                      <h4 class="card-title">2weeks Speeding</h4>
                    </template>
                    <line-chart :width="1000" :height="400"></line-chart>                                    
                  </v-card>
                </v-flex>                              
              </v-layout>
            </v-flex>
            
            <v-flex d-flex xs12 sm6>
              <v-card color="white">
                <v-card-title primary class="title">Speeding ID&nbsp;&nbsp;/&nbsp;&nbsp;Overspeed</v-card-title>                                
                <l-table :data="tableData.data" :columns="tableData.columns">
                  <template slot="columns"></template>

                  <template slot-scope="{row}">                
                    <td><a href="#" @click="getTableList($event)">{{row.txid}}</a></td>
                    <td>{{row.vihiclespeed + " km"}}</td> 
                  </template>
                </l-table>
                <div class="footer">

                  <hr>
                  <div class="stats">
                    <!-- <i class="fa fa-history" @click="updateData(event)"></i> Updated every 6 seconds -->
                  </div>
                </div>
              </v-card>
            </v-flex>                
          </v-layout>
        </v-container>
      </v-app>
   </div>
 </div>
</template>
<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
  import LineChart from 'src/components/UIComponents/Cards/LineChart.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
  import axios from 'axios'
  import SockJS from 'sockjs-client'
  // import Stomp from 'stompjs'

  export default {
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard,
      LineChart
    },    
    data () {
      return {
        stompClient: null,
        connected: false,
        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',        
        speedBlockCnt: '',            
        tableData: {
          data: []
        }
      }
    },    
    created: function () {     
     this.getSpeedList();
     //this.ready();
     this.getBlokcCount();
     this.connectList();
     this.connectCnt();
    },
    methods : {
      connectList: function () {
        var _self = this;
        this.socket = new SockJS('http://localhost:8081/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {
          this.connected = true; 

          this.subscribe('/subscribe/broadcast3', function (message) {
              var contents = JSON.parse(message.body).speedDataResponse;
              for (var i=0; i < contents.length; i ++) {
                  var overspeed = contents[i].vihiclespeed - 100;                        
                  contents[i].vihiclespeed = overspeed;
                  _self.$set(_self.tableData.data, i, contents[i]);
              }                                              
          });  
          
        });


      },
      connectCnt: function () {
        var _self = this;           
        this.socket = new SockJS('http://localhost:8081/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {          
        this.connected = true; 
        
        this.subscribe('/subscribe/broadcast4', function (message) {
            var obj = JSON.parse(message.body);
            console.log(obj);
            _self.speedBlockCnt = obj.speedCnt;
        });

        });
      },
      getTableList: function(event) {
        this.$router.push( { path : '/admin/speedings/'+event.path[0].innerText });
      },      
      getBlokcCount: function () {
        var _self = this;
        axios.get('http://localhost:8081/v1/speedCnts/current', { headers: { 'Access-Control-Allow-Origin': true }})
        .then(function (response) {          
          //_self.speedBlockCnt = response.data.speedCnt;
        })
        .catch(function (error) {
          console.log('an error occured.'+error());
        })
      },     
     getSpeedList: function () {
      // var _self = this;
      // axios.get('http://localhost:8081/v1/speeds/lists', { headers: { 'Access-Control-Allow-Origin': true }})
      // .then(function (response) {        
      //   for(let i = 0; i < response.data.data.speedDataResponse.length; i++) {
            
      //       var overspeed = response.data.data.speedDataResponse[i].vihiclespeed - 100;                        
      //       response.data.data.speedDataResponse[i].vihiclespeed = overspeed;
            
      //     _self.$set(_self.tableData.data, i, response.data.data.speedDataResponse[i]);          
      //   }
      // })
      // .catch(function (error) {
      //   console.log('an error occured.'+error);
      // })
    },
    // ready: function () {
    //   this.getSpeedList();

    //   setInterval(function () {
    //     this.getSpeedList();
    //     console.log('this is setInterval!');
    //   }.bind(this), 6000); //6 seconds
    //  }
    }
  }
</script>
<style>
  .row2 {
    display: flex;
  }
  .col-md-8 {
    width: 800px;
    margin-right: 1px;
    flex: 0 0 40%; 
    /* flex: 1;    */
  }
  .col-md-4{
    /* flex: 1;    */
  }
  .column1{
    width: 450px;
    margin-right: 200px;
  }
</style>
