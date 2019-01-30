<template>
  <gmap-map
    id="map"
    :center="center"
    :zoom="13"
    :options="options"
  >
  <!-- 위에 이 옵션 삭제(지도 지형 타입으로 보이게 함.) : map-type-id="terrain" -->
    <gmap-marker :position="center">
    </gmap-marker>
  </gmap-map>
</template>

<script>
import Vue from 'vue'
  
  export default {
    name: "Maps",
    props: ['lat', 'lng'],
    data () {
      return {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        options: {
          styles: [
            {
            'featureType': 'water',
            'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]
          }, 
          {
            'featureType': 'road',
            'elementType': 'geometry.fill',
            'stylers': [{'hue': '#ff0000'}, {'saturation': -100}, {'lightness': 99}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{'color': '#808080'}, {'lightness': 54}]
          }, {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ece2d9'}]
          }, {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ccdca1'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [{'color': '#767676'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.stroke',
            'stylers': [{'color': '#ffffff'}]
          }, {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]}, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry.fill',
            'stylers': [{'visibility': 'on'}, {'color': '#b8cb93'}]
          }, {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.sports_complex',
            'stylers': [{'visibility': 'on'}]
          }, {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.business',
            'stylers': [{'visibility': 'simplified'}]
          }
          ]
        }
      }
    }
  }
</script>
<style>
  #map {
    /* min-height: calc(100vh - 200px); */
    height: 490px;
    position: relative;
    /* width: 100%;
    height: calc(100% - 100px); */
  }
</style>
