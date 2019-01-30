<template>
      <div class="container clearfix blue1">
			<div class="graphZone">
				<div class="today" style="height: 582px;">
          <!-- today's speeding cnt  -->
					<h3>Today's Speedings</h3>          
					<div class="todays text-color">{{ speedBlockCnt }}</div>
          
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
              <th class="textAleft" width="79%">Speeding ID</th>
              <th class="textAright">Overspeed</th>
            </tr>
          </thead>

          <ListComponent :detail="detail"></ListComponent>
        
				</table>
			</div>
		</div>
</template>
<script>
  import LineChart from 'src/components/UIComponents/Cards/LineChart.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import ListComponent from 'src/components/Dashboard/Views/ListComponent.vue'
  import axios from 'axios'
  import SockJS from 'sockjs-client'
  import graphImg from '@/assets/static/images/graph.png'
  // import Stomp from 'stompjs'

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
        graphImg: graphImg,
        stompClient: null,
        connected: false,
        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',        
        speedBlockCnt: '',            
        tableData: {
          data: []
        },
        checkTxidValue: ''
      }
    },    
    created: function () {
     this.connectCnt();

    },
    methods : {
      setTimeout: function() {

      },
      connectCnt: function () {
        var _self = this;
        this.socket = new SockJS('http://'+this.localUrl+':8081/ws');
        this.stompClient = Stomp.over(this.socket);

        // connect
        this.stompClient.connect({}, function (frame) {
        this.connected = true; 

          this.subscribe('/subscribe/broadcast2', function (message) {

            var obj = JSON.parse(message.body).speedCnt;
            _self.speedBlockCnt = obj.speedCnt;

            // var check_message = JSON.parse(message.body).message;
            //   // flag check
            //   if(!check_message) {
            //     console.log("this is api call");
            //     // page_index check
            //     if(_self.page_index == 0 ) {
            //       //call api
            //       axios.get('http://'+_self.localUrl+':8081/v1/speedCnts/current', { headers: { 'Access-Control-Allow-Origin': true }})
            //       .then(function (response) {
            //         _self.speedBlockCnt = response.data.speedCnt;
            //       })
            //       .catch(function (error) {
            //         console.log('an error occured.'+error);
            //       })
            //       _self.page_index++;
            //     }
            //   } else if(check_message == "speed_change") {
            //     var obj = JSON.parse(message.body).speedCnt;
            //     _self.speedBlockCnt = obj.speedCnt;
            //   }

          });
        });
      }
    }
  }
</script>
<style scoped>
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
  .blue1{
    background-color:white;
  }
  .container{
    /* max-width: 1300px; */
    max-width: inherit;
  }
  .theme--light.v-card{
    width: 98%;
    margin: auto;
  }
</style>
