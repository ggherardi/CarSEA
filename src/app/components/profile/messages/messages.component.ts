import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  message = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit() {
  }

  sendMessage(f) {
    console.log(f);
  }
}
