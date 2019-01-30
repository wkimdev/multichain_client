<template>
  <div class="container clearfix blue1">
    <div class="info">
      <div class="info-title">Speeding ID</div>
      <div class="address">
        <p><div class="text-color">{{ this.$route.params.id }}</div></p>
      </div>	
      <section class="clearfix">
        <div class="info-table">
          <table>
            <tbody>
            <tr v-for="(data, index) in table1.data">
              <th class="textAleft">{{ data.column }}</th>
              <div v-if="data.column === 'Location'">
                <th class="textAright text-color" ><a href="#" v-on:click="showModalPop($event)">{{ data.data | truncate }}</a></th>
                <modals-container />
              </div>
                

              <div v-else>
                <!-- <td class="textAright text-color">{{ data.data }}</td> -->
                <th class="textAright text-color" >{{ data.data }}</th>
              </div>
              
            </tr> 
            </tbody>

          </table>
          <div class="btnZone textAright">
            <button type="button"> {{ confirmCnt }} Confirmations </button>
          </div>
        </div>
        <div class="info-image">
          <!-- <img src="images/test_car.png" alt=""> -->
          <img id="imgElem" style="width: 340px; height: 380px;" @click.prevent="imageClickEvent($event)"></img>
        </div>

      </section>
    </div>
    <div class="lastest-info">
				<div class="info-title">Latest Speeding ID</div>	
				<div class="address" style="padding: 20px;">
					<table>
						<col>
  						<col width="20%">
  						<col>

              <tr v-for="(data, index) in lastDataTable.data">
                <td><a class="flink" href="#" @click="getThisTableList($event)">{{ data.txid }}</a></td>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <td>{{ data.date }}</td>
                <td>{{ data.location }}</td>
              </tr>

						</tr> 
					</table>
				</div>	
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
      column: 'Person',
      data: ''    
    },
    {
      column: 'State',
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
        confirmCnt: '',        
        streamId: this.$route.params.id,
        lat: '',
        lng: '',        
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
          this.getDoorAccessSearchResult();    
          this.getlatestFingerPrint();            
      }      
    },
    beforeRouteUpdate (to, from, next) {      
      next();
    },
    created: function () {
      // data 영역      
      this.getDoorAccessSearchResult();
      this.getlatestFingerPrint();      
    },    
    methods: {
      getThisTableList: function(event) {
        this.$router.push( { path : '/admin/doorAccess/'+event.path[0].innerText });                        
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
      getDoorAccessSearchResult: function () {
      var _self = this;    
      var doorAccessId = this.$route.params.id;      
      axios.get('http://localhost:8081/v1/search/fingerprints/'+doorAccessId
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

       var data_value = [];              
       data_value[0] = _self.getDateformatConvert(response.data.data.data.json.date);
       data_value[1] = response.data.data.data.json.location;

       if(response.data.data.data.json.state == "FINGER_TRUE"){
          var person_check = data.data.data.json.person;
        } else {
          var person_check = "Unknown";
        }       
       data_value[2] = person_check;       
       data_value[3] = response.data.data.data.json.state;
       
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
     getlatestFingerPrint: function() {
      var _self = this;
      axios.get('http://localhost:8081/v1/fingerPrints/lists', { headers: { 'Access-Control-Allow-Origin': true }})
      .then(function (response) {        
        for(let i = 0; i < response.data.data.dataResponse.length; i++) {          
          var c_date = response.data.data.dataResponse[i].date;
          var g_date = _self.getDateformatConvert(c_date);
          response.data.data.dataResponse[i].date = g_date;

          var person_name = response.data.data.dataResponse[i].state;
          if(person_name == "FINGER_TRUE"){
            response.data.data.dataResponse[i].person = person_name;
          } else {
            response.data.data.dataResponse[i].person = "Unknown";
          }            

          _self.$set(_self.lastDataTable.data, i, response.data.data.dataResponse[i]);
        }
      })
      .catch(function (error) {
        console.log('an error occured.'+error);
      })
    },
    getDateformatConvert: function(param){
       /** 한국시간 --> 바르셀로나 시간 convert */
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
