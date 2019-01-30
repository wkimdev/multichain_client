<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <div :id="chartId" class="ct-chart"></div>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  import Card from './Card.vue'
  // import chartist from 'chartist'
  import { Line } from 'vue-chartjs'

  export default {
    extends: Line,
    name: 'chart-card',
    components: {
      Card
    },
    data() {
      return {
         chart: null,
         datacollection: {
            // 2 weeks date
            //renderChart: {},
            labels: [],
            datasets: [{
               label: "2weeks Speeding",
               data: [],
               lineTension: 0,
               fill: true,
               borderColor: 'blue',
               backgroundColor: 'transparent',
               borderDash: [5, 5],
               pointBorderColor: 'blue',
               pointBackgroundColor: 'rgba(255,150,0,0.5)',
               pointRadius: 5,
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
                     display: false
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
     this.getDataTwoWeeks();               
     //this.renderChart();
   },
   methods : {
      getDataTwoWeeks: function () {
       var _self = this;
       axios.get('http://localhost:8081/v1/twoweeks', { headers: { 'Access-Control-Allow-Origin': true }})
       .then(function (response) {
         //지향 표현
         for(let i = 0; i < response.data.length; i++) {
           _self.$set(_self.datacollection.labels, i, response.data[i]);
         }
         var labels_array = _self.datacollection.labels;

          axios.get('http://localhost:8081/v1/speeds/graph', { headers: { 'Access-Control-Allow-Origin': true }})
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
            //_self.renderChart(_self.datacollection, _self.options);
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
     this.renderChart(this.datacollection, this.options);
   }
  }
</script>
<style>

</style>
