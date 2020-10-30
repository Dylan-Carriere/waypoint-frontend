import { Component } from '@angular/core';
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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'waypoint-front';
}

