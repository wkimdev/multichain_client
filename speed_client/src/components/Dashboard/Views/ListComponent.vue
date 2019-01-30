<template>
    <tbody>
        <template v-if="this.detail == 0">
                <tr v-for="(data, index) in tableData.data.slice(0, 9)">
                    <td ><div><a href="#" @click="getTableList($event)">{{ data.txid }}</a></div>
                    <p class="checkTxidValue" hidden>{{ data.txid }}</p></td>
                    <td style="width:25%;text-align:right;">{{ data.vihiclespeed }} km</td>
                </tr>

        </template>

        <template v-if="this.detail == 1">

            <tr v-for="(data, index) in lastDataTable.data">
                <td><a class="flink" href="#" @click="getTableList($event)">{{ data.txid }}</a></td>
                <td>{{ data.date }}</td>
                <td>{{ data.location }}</td>
            </tr>

        </template>
        
    </tbody>
</template>

<script>
import moment from 'moment-timezone'
import SockJS from 'sockjs-client'
import axios from 'axios'

export default {
    props: ["detail"],
    data () {
      return { 
        page_index: 0,
        detailParam: this.detail,
        stompClient: null,
        connected: false,
        checkTxidValue: '',
        tableData: {
          data: []
        },
        lastDataTable: {
          data: []
        }
      }
    }, 
    created: function() {
        this.connectList();        
    },
    filters: {
      truncate: function(value) {
        if (value.length > 63) {
          value = value.substring(0, 45) + '...........';
        }
        return value
      }
    },
    methods : {
        formatDDMMM : function (date_param) {
            var param = date_param.replace("T", " ") + " GMT";
            //var glo_date = param.substring(19, 29);        
            var glo_date = param.substr(param.length-10, 10);
            var date_param = param.substring(0, 10)        
            var months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
            var b = param.split(/\D/);
            var month_date = months[Number(b[1])-1] + ' ' + b[2]+', '+b[0];

            var date_full = param.substring(14, 19) //full date
            var date_hour = param.substring(11, 13) 
            var hour = Number(date_hour);        
            var _time = (hour > 12) ? (hour-12 + ':' + date_full +' PM') : (hour + ':' + date_full +' AM');
            var full_date = month_date+" "+_time+ " "+glo_date;
            return full_date;
        },
        connectList: function () {
        var _self = this;
        this.socket = new SockJS('http://'+this.localUrl+':8081/ws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {
          this.connected = true; 

          this.subscribe('/subscribe/broadcast2', function (message) {

            var contents = JSON.parse(message.body).speedDataResponse;

            for (var i=0; i < contents.length; i ++) {
                if (_self.detailParam == 0 ) {
                    var overspeed = contents[i].vihiclespeed - 100;                        
                    contents[i].vihiclespeed = overspeed;
                    _self.$set(_self.tableData.data, i, contents[i]);
                } else {
                    var c_date = contents[i].date;
                    var g_date = _self.formatDDMMM(c_date);
                    contents[i].date = g_date;
                    _self.$set(_self.lastDataTable.data, i, contents[i]);          
                }
            }
            //   var check_message = JSON.parse(message.body).message;
            //   // flag check
            //   if(!check_message) {
            //       // page_index check
            //       if(_self.page_index == 0 ) {
            //           //call api
            //           axios.get('http://'+_self.localUrl+':8081/v1/speeds/lists', { headers: { 'Access-Control-Allow-Origin': true }})
            //           .then(function (response) {

            //                 for (let i = 0; i < response.data.data.speedDataResponse.length; i++) {
            //                     if (_self.detailParam == 0 ) { 
            //                         var overspeed = response.data.data.speedDataResponse[i].vihiclespeed - 100;                        
            //                         response.data.data.speedDataResponse[i].vihiclespeed = overspeed;
            //                         _self.$set(_self.tableData.data, i, response.data.data.speedDataResponse[i]);    
            //                     } else {
            //                         var c_date = response.data.data.speedDataResponse[i].date;
            //                         var g_date = _self.getDateformatConvert(c_date);
            //                         response.data.data.speedDataResponse[i].date = g_date;
            //                         _self.$set(_self.lastDataTable.data, i, response.data.data.speedDataResponse[i]);          
            //                     }
            //                 }
            //             })
            //             .catch(function (error) {
            //                 console.log('an error occured.'+error);
            //             })
            //             _self.page_index++;
            //       }
            // } else if(check_message == "speed_change") {
            //     var contents = JSON.parse(message.body).speedDataResponse;

            //     for (var i=0; i < contents.length; i ++) {
            //        if (_self.detailParam == 0 ) {
            //             var overspeed = contents[i].vihiclespeed - 100;                        
            //             contents[i].vihiclespeed = overspeed;
            //             _self.$set(_self.tableData.data, i, contents[i]);
            //        } else {
            //             var c_date = contents[i].date;
            //             var g_date = _self.getDateformatConvert(c_date);
            //             contents[i].date = g_date;
            //             _self.$set(_self.lastDataTable.data, i, contents[i]);          
            //         }
            //     }
            //   }

          });  
        });
      },
      getTableList: function(event) {
        this.$router.push( { path : '/admin/speedings/'+event.path[0].innerText });
        this.page_index = 0;
      }
    }
}
</script>

<style scoped>
  .flink{
        text-align: left;
  }

  a{
    color: #47abc7;
    text-decoration: none;    
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    text-align: right;
  }
</style>
