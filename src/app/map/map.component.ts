import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
const toulouseAirportGeofence = require('./toulouseAirport.json');
import Amplify, {Auth} from "aws-amplify";


Amplify.configure( {
  Auth: {
    identityPoolId: 'eu-west-1:b05841f4-5425-4356-807d-f490ad3dbdad',
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_9aZYRGztL',
    userPoolWebClientId: '2s0nj0cqqnc2jrftp8lv9mhgs8'
  }
});

// You can get the current config object
const currentConfig = Auth.configure();

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 43.63085694273947;
  lng = 1.3628196716308594;

  constructor() { }

  ngOnInit(): void {

    this.getJwtToken();

    this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: 'map',
        style: this.style,
        zoom: 12,
        center: [this.lng, this.lat]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    var pointOut = new mapboxgl.Marker()
      .setLngLat([1.3825607299804685, 43.6455164852693])
      .addTo(this.map);

    var pointIn = new mapboxgl.Marker()
      .setLngLat([1.3629913330078125, 43.629738695241485])
      .addTo(this.map);
      
    this.map.on('load', function () {
      this.addSource('toulouseAirport', {
        'type': 'geojson',
        'data': toulouseAirportGeofence
      });

      this.addLayer({
        'id': 'toulouseAirport-layer',
        'type': 'fill',
        'source': 'toulouseAirport',
        'layout': {},
        'paint': {
          'fill-color': '#4682B4',
          'fill-opacity': 0.45
          }
        });
      });
      
  }

  async getJwtToken(){

    const userToken = (await Auth.currentSession()).getIdToken().getJwtToken();
    
    console.log(userToken);
  }

}
