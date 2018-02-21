import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private menuItems: any[] = [
    { 'title' : 'Test1', 'link' : ''}
  ];
  private config = {

  };

  constructor() { }

  ngOnInit() {
  }

  public onMenuClose() {
    console.log('menu closed');
  }
  public onMenuOpen() {
    console.log('menu Opened');
  }
  private onItemSelect(item: any) {
    console.log(item);
  }

}
