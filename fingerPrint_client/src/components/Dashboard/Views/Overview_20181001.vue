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
                    <!-- <v-card-title primary class="title">Today's Number of Access {{ accessBlockCnt }}</v-card-title> -->
                    <v-card-text>
                       <h3>Today's Number of Access  {{ accessBlockCnt }} </h3>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex d-flex>                  
                  <v-card color="white">                    
                    <template slot="header">
                      <h4 class="card-title">2weeks Access</h4>
                    </template>
                    <line-chart :width="1000" :height="400"></line-chart>
                    <template slot="footer">
                      <div class="legend">
                        <i class="fa fa-circle text-info"></i>The number of daily access count that occurred during the last 2 weeks
                      </div>
                      <hr>
                      <div class="stats">
                        <!-- <i class="fa fa-history"></i> Updated now -->
                      </div>
                    </template>                    
                  </v-card>
                </v-flex>                              
              </v-layout>
            </v-flex>
            
            <v-flex d-flex xs12 sm6>
              <v-card color="white">
                <v-card-title primary class="title">Access ID&nbsp;&nbsp;/&nbsp;&nbsp;Person</v-card-title>                

                <template slot="header">
              <h4 class="title">Access ID&nbsp;&nbsp;&nbsp;&nbsp;Person</h4>              
                </template>
                <l-table :data="tableData.data" :columns="tableData.columns">
                  <template slot="columns"></template>

                  <!-- web socket -->
                  <template slot-scope="{row}">                
                    <td><a class="flink" href="#" @click="getTableList($event)">{{row.txid}}</a></td>
                    
                    <template v-if="row.person == null">
                      <td>unknown</td>
                    </template>
                    <td>{{row.person}}</td>
                    
                  </template>

                </l-table>
                <div class="footer">

                  <hr>
                  <div class="stats">                    
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
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import LineChart from 'src/components/UIComponents/Cards/LineChart.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
  import axios from 'axios'

  export default {
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard,
      LineChart
    },
    mounted() {
     //this.getDataTwoWeeks();
    },
    data () {
      return {
        stompClient: null,
        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',        
        accessBlockCnt: '',
        connected: false,
        lineChart: {
          data: { 
            labels: [],
            series: []
          },
          options: {
            low: 0,
            high: 20,
            showArea: false,
            height: '245px',
            axisX: {
              showGrid: true
            },
            lineSmooth: true,
            showLine: true,
            showPoint: true,
            fullWidth: true,
            fullWidth: false,
            chartPadding: {
              right: 6
            }
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },        
        tableData: {
          data: []
        }
      }
    },    
    created: function () {     
     this.getFingerPrintList();
     //this.ready(); --> not work
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

          this.subscribe('/subscribe/broadcast', function (message) {
              var contents = JSON.parse(message.body).dataResponse;
              for (var i=0; i < contents.length; i ++) {              
                if(contents[i].state == "FINGER_TRUE"){
                  var person_check = contents[i].person;
                } else {
                  var person_check = "Unknown";
                }

                contents[i].person = person_check;
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

        //{"fingerPrintCnt":0}
        this.subscribe('/subscribe/broadcast2', function (message) {
            var obj = JSON.parse(message.body);
            _self.accessBlockCnt = obj.fingerPrintCnt;
        });

        });
      },
      disconnect: function() {
        if(this.stompClient != null) {
        this.stompClient.disconnect();
 	      console.log("Disconnected");
        }
      },
      updateData: function() {
        alert('update!');
      },
      getTableList: function(event) {        
        this.$router.push( { path : '/admin/doorAccess/'+event.path[0].innerText });
      },      
      getBlokcCount: function () {
        // websocket
        // var _self = this;
        // axios.get('http://localhost:8081/v1/fingerPrintCnts/current', { headers: { 'Access-Control-Allow-Origin': true }})
        // .then(function (response) {          
        //   _self.accessBlockCnt = response.data.fingerPrintCnt;
        // })
        // .catch(function (error) {
        //   console.log('an error occured.'+error());
        // })
      },      
     getFingerPrintList: function () {
      // var _self = this;   

      // // TODO : web socket
      // axios.get('http://localhost:8081/v1/fingerPrints/lists', { headers: { 'Access-Control-Allow-Origin': true }})
      // .then(function (response) {        
      //   for(let i = 0; i < response.data.data.dataResponse.length; i++) {

      //     if(response.data.data.dataResponse.state == "FINGER_TRUE"){
      //         var person_check = response.data.data.dataResponse.person;
      //     } else {
      //         var person_check = "unknown";
      //     }
      //     response.data.data.dataResponse[i].person = person_check;
      //     //_self.$set(_self.tableData.data, i, response.data.data.dataResponse[i]);
      //   }
      //   })
      // .catch(function (error) {
      //   console.log('an error occured.'+error);
      // })
    },
    ready: function () {
      this.getFingerPrintList();

      setInterval(function () {
        this.getFingerPrintList();        
      }.bind(this), 6000); //6 seconds
     }
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
  .fa fa-circle text-info{
    color:#e83e8c;    
  }
  .flink {
    color:#e83e8c;    
  }

</style>
