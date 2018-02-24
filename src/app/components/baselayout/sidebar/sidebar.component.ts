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
    title: 'Il mio profilo', link: '#', isVisible: this.app.shared.userLogged,
    subItems: [
              {title: 'Il mio profilo', link: 'myprofile/details'},
              {title: 'Viaggi offerti', link: '#'},
              {title: 'Viaggi prenotati', link: '#'}
            ]
  };
  private menuItemsArray: any[] = [
    this.myProfileMenuItem,
    { title: 'Offri un passaggio', link: 'newtrip/pathchooser' },
    { title: 'Cerca un passaggio', link: '#' }
  ];

  private config = {
    animation: 'elastic',
    closeOnCLick: true
  };

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.app.shared.userLogged !== this.logged) {
      if (this.app.shared.userLogged) {
        this.menuItemsArray.unshift(this.myProfileMenuItem);
      } else {
        this.menuItemsArray.shift();
      }
      this.logged = this.app.shared.userLogged;
    }
  //   this.menuItemsArray = [
  //     { title: 'Il mio profilo', link: '#', isVisible: this.app.shared.userLogged,
  //       subItems: [
  //                 {title: 'Il mio profilo', link: 'myprofile/details'},
  //                 {title: 'Viaggi offerti', link: '#'},
  //                 {title: 'Viaggi prenotati', link: '#'}
  //               ]},
  //     { title: 'Offri un passaggio', link: 'newtrip/pathchooser' }
  // ];
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
