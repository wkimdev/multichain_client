<script>
  import axios from 'axios'
  import SockJS from 'sockjs-client'
  import { Line } from 'vue-chartjs'
  export default {
   extends: Line,
   data() {
      return {
         page_index: 0,
         localUrl: this.localUrl,
         chart: null,
         datacollection: {
            // 2 weeks date
            //renderChart: {},
            labels: [],
            datasets: [{
               label: "Today's Speeding",
               data: [],
               //lineTension: 0,
               fill: true,
               borderWidth: 4,
               borderColor: '#1DC7EA',
               backgroundColor: 'transparent',
               borderDash: [5, 0],
               pointBorderColor: '#1DC7EA',
               pointBackgroundColor: 'rgba(255,150,0,0.5)',
               pointRadius: 4,
               pointHoverRadius: 10,
               pointHitRadius: 30,
               pointBorderWidth: 2,
               pointStyle: 'rectRounded'
            }]
         },
         //Chart.js options that controls the appearance of the chart
         options: {
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true
                  },
                  gridLines: {
                     display: true
                  }
               }],
               xAxes: [{
                  gridLines: {
                     display: true
                  }
               }]
            },
            legend: {
               display: true
            },
            responsive: true,
            maintainAspectRatio: false
         }
      }
   },
   created: function () {
     this.connectGraph(); //- origin
     //this.getDataTwoWeeks();
     // data mapping issue. 만약 resize이슈가 또 발생하면 아래 주석을 지우고 실행.               
     //this.renderChart();
   },
   methods : {
      connectGraph: function() {
        var _self = this;
        
        this.socket = new SockJS('http://'+this.localUrl+':8081/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {
        this.connected = true; 

        var labels_array = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        
        for(let i = 0; i < labels_array.length; i++) {
           _self.$set(_self.datacollection.labels, i, labels_array[i]);
         }

          this.subscribe('/subscribe/broadcast2', function (message) {
            var check_message = JSON.parse(message.body).message;                        

              //if (!check_message) {
              if (check_message === undefined) {
                // page_index check
              if(_self.page_index == 0 ) {
                //call api
                axios.get('http://'+_self.localUrl+':8081/v1/speeds/graph', { headers: { 'Access-Control-Allow-Origin': true }})
                .then(function (response) {
                  var datas_array = response.data.data.dataResponse;
                  var array_result = [];

                  // 숫자 변환
                  for(var j = 0; j < datas_array.length ; j++ ){
                    if(datas_array[j].date.length == 1){
                        var date2 = "0" + datas_array[j].date;
                        datas_array[j].date = date2;
                    }
                  }

                  // graph data
                    for(var i = 0; i < labels_array.length ; i++ ) {
                        var checkValue = false;
                            
                        for(var k = 0; k < datas_array.length ; k++ ){
                            if(datas_array[k].date === labels_array[i]){
                              array_result.push(datas_array[k].speedCnt);
                              checkValue = true;
                          }
                        }

                        if (checkValue === false) {
                          array_result.push(0);
                        }
                    }

                  

                  _self.datacollection.datasets[0].data = array_result;
                  _self.renderChart(_self.datacollection, _self.options);            
                })
                .catch(function (error) {
                  console.log('an error occured.'+error);
                })
                _self.page_index++;
              }
            } else if(check_message == "speed_change") {
              // websocket
              var datas_array = JSON.parse(message.body).dataResponse;
              var array_result = [];

              // 숫자 변환
              for(var j = 0; j < datas_array.length ; j++ ){
                if(datas_array[j].date.length == 1){
                    var date2 = "0" + datas_array[j].date;
                    datas_array[j].date = date2;
                }
              }

              // graph data
              for(var i = 0; i < labels_array.length ; i++ ) {
                var checkValue = false;
                for(var j = 0; j < datas_array.length ; j++ ){
                  if(datas_array[j].date === labels_array[i]){
                      array_result.push(datas_array[j].speedCnt);
                      checkValue = true;
                  }
                }                
                if (checkValue === false) {
                  array_result.push(0);
                }
              }

              _self.datacollection.datasets[0].data = array_result;
              _self.renderChart(_self.datacollection, _self.options);
            }

          });
        });
        
      },
      connectGraphOld: function() {
        var _self = this;
        
        this.socket = new SockJS('http://'+this.localUrl+':8081/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {
        this.connected = true; 

          this.subscribe('/subscribe/broadcast2', function (message) {
            var check_message = JSON.parse(message.body).message; 
            
              //console.log('this is check_message is not null :'+response);
              var labels_array = [];
              var date_array = JSON.parse(message.body).twoWeeksDate;

              for(let i = 0; i < date_array.length; i++) {
                  _self.$set(_self.datacollection.labels, i, date_array[i]);
              }         
                var labels_array = _self.datacollection.labels;         
                
              // websocket
              var datas_array = JSON.parse(message.body).dataResponse;
              var array_result = [];

              for(var i = 0; i < labels_array.length ; i++ ) {
                var checkValue = false;
                for(var j = 0; j < datas_array.length ; j++ ){
                  if(datas_array[j].date === labels_array[i]){
                      array_result.push(datas_array[j].speedCnt);
                      checkValue = true;
                  }
                }                
                if (checkValue === false) {
                  array_result.push(0);
                }
              }

              _self.datacollection.datasets[0].data = array_result;

              // 데이터 변경시에만 render
              // 변경 없을시 1번 렌더 
              if(check_message === undefined) {
                if(_self.page_index == 0 ) {
                  console.log('check _self.page_index :'+_self.page_index);
                  // 처음 화면 호출시 한번 렌더 
                  _self.renderChart(_self.datacollection, _self.options);
                  _self.page_index ++;
                } 
              } else if (check_message == "speed_change") {
                _self.renderChart(_self.datacollection, _self.options);
              }

           })
        })
                
      },      
      getDataTwoWeeks: function () {
       var _self = this;       

       axios.get('http://'+_self.localUrl+':8081/v1/twoweeks', { headers: { 'Access-Control-Allow-Origin': true }})
       .then(function (response) {
         //지향 표현
         for(let i = 0; i < response.data.length; i++) {
           _self.$set(_self.datacollection.labels, i, response.data[i]);
         }
         var labels_array = _self.datacollection.labels;         
          axios.get('http://'+_self.localUrl+':8081/v1/speeds/graph', { headers: { 'Access-Control-Allow-Origin': true }})
          .then(function (response) {
            var datas_array = response.data.data.dataResponse;
            var array_result = [];

            for(var i = 0; i < labels_array.length ; i++ ){
                var checkValue = false;
                for(var j = 0; j < datas_array.length ; j++ ){
                  if(datas_array[j].date === labels_array[i]){
                      array_result.push(datas_array[j].speedCnt);
                      checkValue = true;
                  }
                }                
                if (checkValue === false) {
                  array_result.push(0);
                }
            }
            _self.datacollection.datasets[0].data = array_result;
            _self.renderChart(_self.datacollection, _self.options);            
          })
          .catch(function (error) {
            console.log('an error occured.'+error);
          })
       })
       .catch(function (error) {
         console.log('an error occured.'+error);
       })
      }   
    },    
   mounted() {
      console.log('this is mounted');
      this.renderChart(this.datacollection, this.options);
   }
}
</script>
