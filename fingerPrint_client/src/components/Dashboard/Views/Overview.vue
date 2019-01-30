<template>
  <div class="container clearfix green1">
			<div class="graphZone">
				<div class="today" style="height: 582px;">
          <!-- today's speeding cnt  -->
					<h3>Today's Number of Access</h3>
					<div class="todays text-color">{{ accessBlockCnt }}</div>

					   <v-card color="white">
              <div class="graph-img">
                <line-chart :width="1000" :height="400"></line-chart>
              </div>              
            </v-card>

				</div>
			</div>
			<div class="contents">
				<table width="100%">
					<thead>
            <tr>
              <th class="textAleft" width="79%">Access ID</th>
              <th class="textAright">person</th>
              </tr>
          </thead>

              <ListComponent :detail="detail"></ListComponent>

				</table>
			</div>
		</div>
  
</template> 
<script>
  import LineChart from 'src/components/UIComponents/Cards/LineChart.vue'
  import ListComponent from 'src/components/Dashboard/Views/ListComponent.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from 'axios'

  export default {
    components: {
      Card,
      LineChart,
      ListComponent
    },
    data () {
      return {
        page_index: 0,
        detail: 0,
        localUrl_m: this.localUrl_m,
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
     this.connectCnt();
    },    
    methods : {
      connectCnt: function () {
        var _self = this;
        var socketUrl = 'http://'+_self.localUrl+':8081/ws';
        this.socket = new SockJS(socketUrl);
        this.stompClient = Stomp.over(this.socket);

        // connect
        this.stompClient.connect({}, function (frame) {
        this.connected = true;

        this.subscribe('/subscribe/broadcast', function (message) {
          var check_message = JSON.parse(message.body).message;

          // flag check
          // console.log("this is api call :"+check_message);
          // console.log("this is api type call :"+typeof(check_message));
          // if(check_message == "door_change") {
            var obj = JSON.parse(message.body).doorAccessCnt;            
            _self.accessBlockCnt = obj.fingerPrintCnt;
          // } 
          // else {

          //   console.log("this is api call :"+check_message);
          //   // page_index check
          //   if(_self.page_index == 0 ) {
          //     axios.get('http://'+_self.localUrl+':8081/v1/fingerPrintCnts/current', { headers: { 'Access-Control-Allow-Origin': true }})
          //     .then(function (response) {          
          //       _self.accessBlockCnt = response.data.fingerPrintCnt;
          //     })
          //     .catch(function (error) {
          //       console.log('an error occured.'+error);
          //     })
          //     _self.page_index++;
          //   } 

          // }

          // if(!check_message) {
          //   console.log("this is api call :"+check_message);
          //   // page_index check
          //   if(_self.page_index == 0 ) {
          //     axios.get('http://'+_self.localUrl+':8081/v1/fingerPrintCnts/current', { headers: { 'Access-Control-Allow-Origin': true }})
          //     .then(function (response) {          
          //       _self.accessBlockCnt = response.data.fingerPrintCnt;
          //     })
          //     .catch(function (error) {
          //       console.log('an error occured.'+error);
          //     })
          //     _self.page_index++;
          //   } 
          // } else if(check_message == "door_change") {
          //   console.log("this is websocket call :"+check_message);
          //   var obj = JSON.parse(message.body).doorAccessCnt;            
          //   _self.accessBlockCnt = obj.fingerPrintCnt;
          // }


        });

        });
      },
      disconnect: function() {
        if(this.stompClient != null) {
        this.stompClient.disconnect();
 	      console.log("Disconnected");
        }
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
  .green1{
    background-color:white;
  }
  .container{
    /* max-width: 1300px; */
    max-width: inherit;
  }

  /* list transition */
  @media (max-width:1100px){
    /* .title{float:none;}
    .search{float:none;width:100%;}
    .graphZone{float:none;width:100%;}
    .contents{float:none;width:100%;}
    .info .info-table{float:none;width:100%;}
    .info .info-image{float:none;margin-left:0;text-align:center;margin-top:20px;} */

    .table-overview {
      width:100%;
      }
    }
  
  /* ul {
    list-style-type: none;
    padding-left: 0px;
    margin-top: 0;
    text-align: left;
  }
  li {
    display: flex;
    min-height: 50px;
    height: 50px;
    line-height: 50px;
    margin: 0.5rem 0;
    padding: 0 0.9rem;
    background: white;
    border-radius: 5px;
  } */
  .list-item {
    display: inline-block;
    width:100%;
    /* margin-right: 100px; */
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
    /* background: red; */
    width:100%;
    /* padding: 0 0.9rem;
    line-height: 50px; */
    /* padding: 100px 10px 10px 10px; */
    /* margin-right: 300px; */
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(300px);
    width:100%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }



</style>
