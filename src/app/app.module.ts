import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { PHPService } from './_common/phpService';
import { Cookies } from './_common/cookies';

import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { SignupComponent } from './signup/signup.component';

// enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: BodyComponent
      },
      {
        path: 'myProfile',
        component: SignupComponent,
      },
      {
        path: '**',
        component: HeaderComponent
      }
    ], { enableTracing: true }
    )
  ],
  providers: [
    PHPService,
    Cookies
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
