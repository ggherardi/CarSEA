import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { UserDetail, UserDetailResponse, UserModel } from '../../../_services/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userDetails: UserDetailResponse;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.loadUserDetails();
  }

  private loadUserDetails() {
    let userID = this.getUserID();
    if (!userID) {
      const user: UserModel = this.app.shared.cookies.getObjectFromCookie(this.app.shared.cookies.USER_COOKIE_NAME);
      if (!user) {
        this.app.shared.router.navigateByUrl('');
        return;
      } else {
        userID = user.UserID;
      }
    }
    this.app.shared.loadUserDetails(userID).subscribe(
      this.populateControls.bind(this),
      err => console.log(err)
    );
  }

  private getUserID(): number {
    let userID = this.app.shared.storage.browsedUserID;
    if (!userID) {
      const user: UserModel = this.app.shared.cookies.getObjectFromCookie(this.app.shared.cookies.USER_COOKIE_NAME);
      if (!user) {
        this.app.shared.router.navigateByUrl('');
      } else {
        userID = user.UserID;
      }
    }
    return userID;
  }

  private populateControls(res) {
    this.userDetails = JSON.parse(res);
  }
}
