import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./sidebar.component.css?ver=${new Date().getTime()}']
})
export class SidebarComponent implements OnInit, DoCheck {
  private logged = this.app.shared.userLogged;
  private myProfileMenuItem: any = {
    title: 'Il mio profilo', link: '#',
    subItems: [
              {title: 'Il mio profilo', link: 'myprofile/details'},
              {title: 'Messaggi', link: 'myprofile/messages'},
              {title: 'Viaggi offerti', link: 'myprofile/offeredtrips'},
              {title: 'Viaggi prenotati', link: 'myprofile/mytrips'}
            ]
  };
  private baseMenuItemsArray: any[] = [
    { title: 'Offri un passaggio', link: 'newtrip/pathchooser' },
    { title: 'Cerca un passaggio', link: 'findpassage' }
  ];

  private config = {
    animation: 'elastic',
    closeOnCLick: true
  };

  constructor(private app: AppComponent) { }

  private addMenuItems() {
    if (this.app.shared.userLogged) {
      this.baseMenuItemsArray.unshift(this.myProfileMenuItem);
    } else {
      this.baseMenuItemsArray.shift();
    }
    this.logged = this.app.shared.userLogged;
  }

  ngOnInit() {
    if (this.baseMenuItemsArray.findIndex(p => p.title === 'Il mio profilo') !== -1) {
      this.addMenuItems();
    }
  }

  ngDoCheck() {
    if (this.app.shared.userLogged !== this.logged) {
      this.addMenuItems();
    }
  }



  public onMenuClose() {
    console.log('menu closed');
  }
  public onMenuOpen() {
    console.log('menu Opened');
  }
  private onItemSelect(item: any) {
    console.log(item);
    this.app.shared.router.navigateByUrl(item.link);
  }

}
