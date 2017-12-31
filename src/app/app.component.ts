import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    jQuery('document').ready(function(){
      $.ajax({
          url: 'lib/Session.php',
          data: {},
          method: 'post',
          success: function(res){
              console.log(res);
          }
      });
  });
  }
}
