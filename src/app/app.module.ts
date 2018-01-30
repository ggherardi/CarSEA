import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
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
import { SharedComponent } from './_common/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { Models } from './_common/models';
import { PathchooserComponent } from './pathchooser/pathchooser.component';

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
  path: 'pathChooser',
  component: PathchooserComponent,
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
    PathchooserComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(sitemap, { enableTracing: false }
    ),
  ],
  providers: [
    PHPService,
    Cookies,
    SharedComponent,
    Models
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
