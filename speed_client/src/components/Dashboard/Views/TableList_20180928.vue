<template>
  <div class="content">
  <div class="container-fluid">  
  <v-app id="inspire">
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 style="margin-top:100px;">
              <v-card>              
              </v-card>
        </v-flex>

        <v-flex xs12>          
         <v-card color="grey lighten-2">      
           <v-card-title primary class="title">Speeding ID : </v-card-title>     
            <v-card-text>
              {{ this.$route.params.id }}
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-layout column>            
            <v-flex d-flex>
              <v-card color="white">                
                <template slot="header">                  
                </template>
                <div class="table-responsive">
                  <l-table class="table-hover table-striped" 
                          :columns="table1.columns"
                          :data="table1.data">                

                      <template slot-scope="{row}">                        
                      <td>{{row.column}}</td>
                      <template v-if="row.column === 'Location'">                          
                          <td><a href="#" v-on:click="showModalPop($event)">{{row.data}}
                        </a></td>
                          <modals-container />
                        
                      </template>
                      <template v-else>
                        <td>{{row.data}}</td>
                      </template>
                    
                    </template>
                  </l-table>                  
                </div>                
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-flex >
                <v-card color="blue lighten-4" dark>
                    <v-card-title primary class="title"> {{ confirmCnt }} Confirmations </v-card-title>                         
                </v-card>
              </v-flex>              
            </v-flex>
          </v-layout>
        </v-flex>
        
        <v-flex d-flex xs12 sm4>
          <v-card color="white" >            
            <v-card-text>              
              <div style="width: auto; height: 400px; overflow: hidden">
              <img class="car-image" id="imgElem" style="width: auto; height: 400px;" @click.prevent="imageClickEvent($event)"></img>              
              </div>
            </v-card-text>
          </v-card>
        </v-flex> 

      </v-layout>
      <v-flex xs12>        
         <v-card color="white">
           <v-card-title primary class="title">Latest Speeding ID</v-card-title>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;Latest Speeding ID list (last 10EA)</div>            
            <v-card-text color="grey lighten-2">
            <div class="table-responsive" >
              <l-table :data="lastDataTable.data" :columns="lastDataTable.columns">
                <template slot="columns"></template>

                <template slot-scope="{row}">                
                  <td><a class="flink" href="#" @click="getThisTableList($event)">{{row.txid}}</a></td>
                  <td>{{row.date}}</td>
                  <td>{{row.location}}</td>
                </template>

                
            </l-table>
            </div>
            </v-card-text>
          </v-card>
        </v-flex>
    </v-container>
  </v-app>

</div>
</div>
</template>

<script>
  import LTable from 'src/components/UIComponents/Table.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import PopupModal from 'src/components/Dashboard/Views/PopupModal.vue'
  import axios from 'axios'
  import moment from 'moment-timezone'

  const tableColumns = ['Column', 'Data']
  const tableData = [
    {
      column: 'Date',
      data: ''    
    },
    {
      column: 'Location',
      data: ''    
    },
    {
      column: 'Vehicle Speed',
      data: ''    
    },
    {
      column: 'Overspeed',
      data: ''    
    },
    {
      column: 'Fine',
      data: ''    
    }  
  ]
  export default {
    components: {
      LTable,
      Card,      
      PopupModal      
    },
    data () {
      return {
        dialog: false,
        showModal: false,
        confirmCnt: '',
        lat: '',
        lng: '',
        streamId: this.$route.params.id,
        table1: { 
          columns: [...tableColumns],
          data: [...tableData]          
        },
        table2: {
          columns: [...tableColumns],
          data: [...tableData]
        },
        lastDataTable: {
          data: []
        }
      }
    },
    watch: {
      '$route': function () {          
          this.getSpeedSearchResult();    
          this.getlatestSpeed();            
      }      
    },
    beforeRouteUpdate (to, from, next) {      
      next();
    },
    created: function () {
      // data 영역
      this.getSpeedSearchResult();    
      this.getlatestSpeed();                      
    },    
    methods: {
      getThisTableList: function(event) {
        this.$router.push( { path : '/admin/speedings/'+event.path[0].innerText });                        
      },   
      showModalPop: function (event) {              
       this.$modal.show(PopupModal,{
                    lat : this.lat,
                    lng : this.lng,
                    modal : this.$modal },{
                        name: 'dynamic-modal',
                        width : '700px',
                        height : '600px',
                        draggable: true,
                    })     

      },   
      imageClickEvent: function (event) {
        var img=new Image();
        img.src=event.path[0].src;
        var img_width=img.width;
        var win_width=img.width+600;
        var height=img.height+500;
        var OpenWindow=window.open('','_blank', 'width='+win_width+', height='+height+', menubars=no, scrollbars=auto');
        OpenWindow.document.write("<style>body{margin:0px;}</style><img src='"+event.path[0].src+"' width='"+win_width+"'>");
      },      
      getDateformatConvert: function(param){
       var date_str = param;              
       var c_date = date_str.substring(0,19);      
       var k_date = moment.tz(c_date, "Asia/Seoul").format();
       var s_date = moment.tz(k_date, "Europe/Madrid").format();        
       var g_date = s_date.replace("T", " ") + " GMT";       
       return this.formatDDMMM(g_date);
     },
     formatDDMMM : function (param) {
        //2018-09-21 05:27:20+02:00 GMT
        var glo_date = param.substring(19, 29);        
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
      getSpeedSearchResult: function () {
      var _self = this;    
      var txid = this.$route.params.id;      
      axios.get('http://localhost:8081/v1/search/speeds/'+txid
      , { headers: { 'Access-Control-Allow-Origin': true }})
      .then(function (response) {        
       if(!response.data.data.checkConfirmNum){
          _self.confirmCnt = 0;
       } else {
         _self.confirmCnt = response.data.data.checkConfirmNum;
       }       
       //lat, lng 셋팅
       _self.lat = parseFloat(response.data.data.data.json.lat);
       _self.lng = parseFloat(response.data.data.data.json.lng); 

       var data_value = {};                               
       data_value["0"] = _self.getDateformatConvert(response.data.data.data.json.date);
       data_value["1"] = response.data.data.data.json.location;
       var vihiclespeed = response.data.data.data.json.vihiclespeed 
       data_value["2"] = vihiclespeed + "km";       

       // 초과속도, fine 계산
       var overspeed = vihiclespeed - 100;       
       data_value["3"] = overspeed +"km";      
       data_value["4"] = ( overspeed * 14 ) + "$";
       
       for(var i = 0; i < tableData.length; i ++){
            tableData[i].data = data_value[i];              
       }
      
      // image 적용
      var image = response.data.data.data.json.clue;
      imgElem.setAttribute('src', image);
      

      })
      .catch(function (error) {
        console.log('an error occured.'+error);
      })

     },     
     getlatestSpeed: function() {
      var _self = this;
      axios.get('http://localhost:8081/v1/speeds/lists', { headers: { 'Access-Control-Allow-Origin': true }})
      .then(function (response) {                        
        for(let i = 0; i < response.data.data.speedDataResponse.length; i++) {                    
          var c_date = response.data.data.speedDataResponse[i].date;
          var g_date = _self.getDateformatConvert(c_date);
          response.data.data.speedDataResponse[i].date = g_date;
          _self.$set(_self.lastDataTable.data, i, response.data.data.speedDataResponse[i]);          
        }

      })
      .catch(function (error) {
        console.log('an error occured.'+error);
      })
    }  
  }
  }
</script>

<style>
  .col-12{
    width: 1000px;    
  }
  .col-14{
    width: 1500px;
  }  
  .car-image {
    width: auto;
    height: 400px;
  }
  .map {
        height: 100%;
      }

  /* Optional: Makes the sample page fill the window. */
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* modal option */
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 700px;
    height: 600px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 1px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

</style>
