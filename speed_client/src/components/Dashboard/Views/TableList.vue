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
            <!-- <tr v-for="(data, index) in table1.data"> -->
              <tr>                
                <th class="textAleft">Date</th>
                <td class="textAright text-color">{{ table1.data[0].data }}</td>
              </tr>
              <tr>                
                <th class="textAleft">Location</th>
                <td class="textAright text-color"><a href="#" v-on:click="showModalPop($event)">{{ table1.data[1].data }}</a></td>                
              </tr>
              <tr>                
                <th class="textAleft">Vehicle Speed</th>
                <td class="textAright text-color">{{ table1.data[2].data }}</td>
              </tr>
              <tr>                
                <th class="textAleft">Overspeed</th>
                <td class="textAright text-color">{{ table1.data[3].data }}</td>
              </tr>
              <tr>                
                <th class="textAleft">Fine</th>
                <td class="textAright text-color">{{ table1.data[4].data }}</td>
              </tr>

            </tbody>
            <modals-container />

          </table>

          <div class="btnZone textAright">
            <button type="button"> {{ confirmCnt }} Confirmations </button>
          </div>
        </div>
        <div class="info-image">
          <img id="imgElem" style="width: 340px; height: 380px;" @click.prevent="imageClickEvent($event)"></img>
        </div>

      </section>
    </div>
    <div class="lastest-info">
				<div class="info-title">Latest Speeding ID</div>	
				<div class="address" style="padding: 20px;">
					<table>
            <ListComponent :detail="detail"></ListComponent>

					</table>
				</div>	
			</div>
  </div>


</template>

<script>
  import LTable from 'src/components/UIComponents/Table.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import PopupModal from 'src/components/Dashboard/Views/PopupModal.vue'
  import ListComponent from 'src/components/Dashboard/Views/ListComponent.vue'
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
      PopupModal,
      ListComponent     
    },
    data () {
      return {
        detail: 1,
        localUrl: this.localUrl,
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
          //this.getlatestSpeed();            
      }      
    },
    beforeRouteUpdate (to, from, next) {      
      next();
    },
    created: function () {
      // data 영역      
      this.getSpeedSearchResult();    
      //this.getlatestSpeed();                      
    },    
    methods: {         
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
     formatDDMMM : function (table_param) {
        var param = table_param.replace("T", " ") + " GMT";
        //var glo_date = param.substring(19, 29); 
        var glo_date = param.substr(param.length-10, 10);
        var date_param = param.substring(0, 10);
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
      axios.get('http://'+this.localUrl+':8081/v1/search/speeds/'+txid
      , { headers: { 'Access-Control-Allow-Origin': true }})
      .then(function (response) {
        console.log('response-test : '+response);
       if(!response.data.data.checkConfirmNum){
          _self.confirmCnt = 0;
       } else {
         _self.confirmCnt = response.data.data.checkConfirmNum;
       }       
       //lat, lng 셋팅
       _self.lat = parseFloat(response.data.data.lat);
       _self.lng = parseFloat(response.data.data.lng); 

       var data_value = {};                               
       data_value["0"] = _self.formatDDMMM(response.data.data.date);
       data_value["1"] = response.data.data.location;
       var vihiclespeed = response.data.data.vihiclespeed 
       data_value["2"] = vihiclespeed + "km";       

       // 초과속도, fine 계산
       var overspeed = vihiclespeed - 100;       
       data_value["3"] = overspeed +"km";      
       data_value["4"] = ( overspeed * 14 ) + "$";
       
       for(var i = 0; i < tableData.length; i ++){
            tableData[i].data = data_value[i];              
       }
      
      // image 적용
      var image = response.data.data.clue;
      imgElem.setAttribute('src', image);
      

      })
      .catch(function (error) {
        console.log('an error occured.'+error);
      })

     }
  }
  }
</script>

<style scoped>
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
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

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
  .blue1{
    background-color:white;
  }
  .container {
    /* max-width: 1361px; */    
    max-width: inherit; 
  }
  /* .flink{
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
  } */

  /* @media (min-width:800px){
    a{
      display: inline-block;
      white-space:initial;      
      overflow:initial;
      text-overflow: initial;      
    }
  } */

</style>
