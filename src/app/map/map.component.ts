import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
const toulouseAirportGeofence = require('./toulouseAirport.json');
import Amplify, {Auth, API} from "aws-amplify";


Amplify.configure( {
  Auth: {
    identityPoolId: 'eu-west-1:add24101-91d6-413b-b189-d01a7a1661cc',
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_2qNLAdVLc',
    userPoolWebClientId: 'hvqm14s5d4r96pv0lgh4e2bhp'
  },
  API: {
    endpoints: [
      {
        name: "dev-serverless-lab",
        endpoint: "https://cwoc30oiga.execute-api.eu-west-1.amazonaws.com/dev",
        custom_header: async () => { 
          return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
          // Alternatively, with Cognito User Pools use this:
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
      }
    ]
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
    this.getMap();

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

  async getMap() { 
    const apiName = 'dev-serverless-lab';
    const path = '/map';
    const myInit = { 
      headers: { 
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    console.log(await API.get(apiName, path, myInit));
  }

}
