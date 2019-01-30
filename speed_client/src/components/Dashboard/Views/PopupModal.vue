<template>
    <div class="container">
        <transition name="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-body">                  
                  <Maps :lat="lat" :lng="lng"></Maps>
                  
                </div>

                <div class="modal-footer">            
                  <slot name="footer">    
                    <b-button class="btn2" @click="$emit('close')" style="padding: 14px;">Close</b-button>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </transition>         
    </div>

     
</template>

<script>
import Maps from 'src/components/Dashboard/Views/Maps.vue'

export default {
  name: "PopupModal",
  components: {
      Maps      
  },
  props: ['lat', 'lng'],  
  data () {
    return {              
    }
  },
  methods : {
      del_data(){          
          this.$emit('close')
      }
  }
}
</script>

<style>
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
    /* display: table-cell;
    vertical-align: middle; */
    display: flex;
    align-items:center;
    justify-content:center;
    height:100%;
  }

  .modal-container {
    display:inline-block;
    /* width:auto; */
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
  
  .btn2 {
    height: 9px;
    line-height: 0.1em;
    width: 30%;
  }
  

</style>
