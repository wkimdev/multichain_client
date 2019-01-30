<template>
    <tbody>
        <template v-if="this.detail == 0">
            <!-- <tbody> -->
            <tr v-for="(data) in tableData.data.slice(0, 9)">
              <td><div><a href="#" @click="getTableList($event)">{{ data.txid }}</a></div>
                <p class="checkTxidValue" hidden>{{ data.txid }}</p></td>
              <td style="text-align:right;">{{data.person}}</td>
            </tr>
            <!-- </tbody> -->

        </template>

        <template v-if="this.detail == 1">

            <tr v-for="(data, index) in lastDataTable.data">
                <td><a class="flink" href="#" @click="getTableList($event)">{{data.txid}}</a></td>                
                <!-- <td style="padding: 0.1px;">{{ data.date }}</td>
                <td style="padding: 0.1px;">{{ data.person }}</td>
                <td style="padding: 0.1px;">{{ data.state }}</td> -->
                <td >{{ data.date }}</td>
                <td >{{ data.person }}</td>
                <td >{{ data.state }}</td>
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
    mounted() {
 	this.$nextTick(function () {
      // remove unwanted element all other is work jQuery required
        var unwrapHtml = this.$refs.unwrap.innerHTML;
        this.$refs.unwrap.parentElement.appendChild(unwrapHtml);
        this.$refs.unwrap.remove();
          //$('.unwrap').contents().unwrap();
  	  })
    },
    created: function() {
        this.connectList();
    },
    filters: {
    //   truncate: function(value) {
    //     if (value.length > 63) {
    //       value = value.substring(0, 45) + '...........';
    //     }
    //     return value
    //   }
    },
    methods : {
        formatDDMMM : function (table_param) {
            var param = table_param.replace("T", " ") + " GMT";
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

          this.subscribe('/subscribe/broadcast', function (message) {
              //var check_message = JSON.parse(message.body).message;
               
               var contents = JSON.parse(message.body).dataResponse;

                if (_self.detailParam == 0 ) {
                    for (var i=0; i < contents.length; i ++) {
                        console.log('this is contents :::: '+contents);
                        if(contents[i].state == "FINGER_TRUE"){
                        var person_check = contents[i].person;
                        } else {
                        var person_check = "Unknown";
                        }
                        contents[i].person = person_check;
                        _self.$set(_self.tableData.data, i, contents[i]);
                    }
                } else {
                    for (var i=0; i < contents.length; i ++) {
                        var c_date = contents[i].date;
                        var g_date = _self.formatDDMMM(c_date);
                        contents[i].date = g_date;

                        var state = contents[i].state;
                        if(state != "FINGER_TRUE"){
                            contents[i].person = "Unknown";
                        } 
                        _self.$set(_self.lastDataTable.data, i, contents[i]);
                    }
                }

          });  
        });
      },      
      getTableList: function(event) {
        //this.$router.push( { path : '/admin/doorAccess/'+event.toElement.nextSibling.nextSibling.innerText });
        this.$router.push( { path : '/admin/doorAccess/'+event.path[0].innerText });                        
        this.page_index = 0;
      },
      getListBack: function() { 
          //this is comment code
           // flag check
            //   if(!check_message) {
            //       // page_index check
            //     if(_self.page_index == 0 ) {
            //         //console.log("this is api call");

            //         if(_self.detailParam == 0 ){
            //             axios.get('http://'+_self.localUrl+':8081/v1/fingerPrints/lists', { headers: { 'Access-Control-Allow-Origin': true }})
            //             .then(function (response) {
            //                 for(let i = 0; i < response.data.data.dataResponse.length; i++) {

            //                 if(response.data.data.dataResponse.state == "FINGER_TRUE"){
            //                     var person_check = response.data.data.dataResponse.person;
            //                 } else {
            //                     var person_check = "unknown";
            //                 }
            //                 response.data.data.dataResponse[i].person = person_check;
            //                 _self.$set(_self.tableData.data, i, response.data.data.dataResponse[i]);
            //                 }
            //             })
            //             .catch(function (error) {
            //                 console.log('an error occured.'+error);
            //             })
            //         } else {
            //             axios.get('http://'+_self.localUrl+':8081/v1/fingerPrints/lists', { headers: { 'Access-Control-Allow-Origin': true }})
            //             .then(function (response) {
            //                 for(let i = 0; i < response.data.data.dataResponse.length; i++) {

            //                 if(response.data.data.dataResponse.state == "FINGER_TRUE"){
            //                     var person_check = response.data.data.dataResponse.person;
            //                 } else {
            //                     var person_check = "unknown";
            //                 }
            //                 response.data.data.dataResponse[i].person = person_check;
            //                 _self.$set(_self.lastDataTable.data, i, response.data.data.dataResponse[i]);
            //                 }
            //             })
            //             .catch(function (error) {
            //                 console.log('an error occured.'+error);
            //             })

            //         }
            //         _self.page_index++;    
            //     }  
            //   } else if(check_message == "door_change") {
            //     //console.log("this is websocket call");
            //     var contents = JSON.parse(message.body).dataResponse;

            //     if (_self.detailParam == 0 ) {
            //         for (var i=0; i < contents.length; i ++) {
            //             console.log('this is contents :::: '+contents);
            //             if(contents[i].state == "FINGER_TRUE"){
            //             var person_check = contents[i].person;
            //             } else {
            //             var person_check = "Unknown";
            //             }
            //             contents[i].person = person_check;
            //             _self.$set(_self.tableData.data, i, contents[i]);
            //         }
            //     } else {
            //         for (var i=0; i < contents.length; i ++) {
            //             var c_date = contents[i].date;
            //             var g_date = _self.getDateformatConvert(c_date);
            //             contents[i].date = g_date;

            //             var state = contents[i].state;
            //             if(state != "FINGER_TRUE"){
            //                 contents[i].person = "Unknown";
            //             } 
            //             _self.$set(_self.lastDataTable.data, i, contents[i]);
            //         }
            //     }

            //   }
      }
    }
}
</script>

<style scoped>
  .flink{
    text-align: left;
  }

  a{
    color: #37d68f;
    text-decoration: none;    
    display: block;    
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    text-align: right;
  }
</style>
