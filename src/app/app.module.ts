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
import { MyprofileComponent } from './myprofile/myprofile.component';
import { NgModel } from '@angular/forms';

const sitemap = [{
  path: '',
  component: BodyComponent
},
{
  path: 'signup',
  component: SignupComponent
},
{
  path: 'myProfile',
  component: MyprofileComponent,
},
{
  path: '**',
  component: HeaderComponent
}];

// enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    SignupComponent,
    MyprofileComponent,
    NgModel
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(sitemap, { enableTracing: false }
    ),
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
