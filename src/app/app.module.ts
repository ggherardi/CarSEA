import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpService } from './_services/httpService';
import { Cookies } from './_services/cookies';
import { AgmCoreModule } from '@agm/core';

import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { SignupComponent } from './signup/signup.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { SharedComponent } from './_services/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { Models } from './_services/models';
import { PathchooserComponent } from './pathchooser/pathchooser.component';
import { PolylineManager } from '@agm/core/services/managers/polyline-manager';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { GooglemapsService } from './_services/googlemaps.service';
import { PricechooserComponent } from './pricechooser/pricechooser.component';
import { ConstantsService } from './_services/constants.service';

const googleMapsAPIKey = 'AIzaSyCb2-mkLHWGdDBQAchtHhuQcucgbPNuO-M';

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
  path: 'adminpanel',
  component: AdminpanelComponent,
},
{
  path: 'newtrip/pathChooser',
  component: PathchooserComponent,
},
{
  path: 'newtrip/priceChooser',
  component: PricechooserComponent,
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
    PathchooserComponent,
    AdminpanelComponent,
    PricechooserComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NguiAutoCompleteModule,
    RouterModule.forRoot(sitemap, { enableTracing: false }),
    AgmCoreModule.forRoot({ apiKey:  googleMapsAPIKey})
  ],
  providers: [
    HttpService,
    Cookies,
    SharedComponent,
    Models,
    PolylineManager,
    GooglemapsService,
    ConstantsService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
