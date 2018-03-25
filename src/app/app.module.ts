import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpService } from './_services/httpService';
import { Cookies } from './_services/cookies';
import { AgmCoreModule } from '@agm/core';
import { Ng2PaginationModule, PaginationService } from 'ng2-pagination';
import { AppComponent } from './app.component';
import { PersonaldetailsComponent } from './components/profile/personaldetails/personaldetails.component';
import { SidebarComponent } from './components/baselayout/sidebar/sidebar.component';
import { BodyComponent } from './components/baselayout/body/body.component';
import { SignupComponent } from './components/profile/signup/signup.component';
import { MytripsComponent } from './components/profile/mytrips/mytrips.component';
import { AdminpanelComponent } from './components/profile/adminpanel/adminpanel.component';
import { PathchooserComponent } from './components/trips/pathchooser/pathchooser.component';
import { PricechooserComponent } from './components/trips/pricechooser/pricechooser.component';
import { PagenotfoundComponent } from './components/baselayout/pagenotfound/pagenotfound.component';
import { HeaderComponent } from './components/baselayout/header/header.component';
import { FooterComponent } from './components/baselayout/footer/footer.component';
import { SharedComponent } from './_services/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Models } from './_services/models';
import { PolylineManager } from '@agm/core/services/managers/polyline-manager';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { GooglemapsService } from './_services/googlemaps.service';
import { ConstantsService } from './_services/constants.service';
import { NgbModule, NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { SlideMenuModule } from 'cuppa-ng2-slidemenu/cuppa-ng2-slidemenu';
import { FindpassageComponent } from './components/trips/findpassage/findpassage.component';
import { OfferedtripsComponent } from './components/profile/offeredtrips/offeredtrips.component';
import { ApiAutocompleteComponent } from './components/shared/apiautocomplete/apiautocomplete.component';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { TripabstractComponent } from './components/shared/tripabstract/tripabstract.component';
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
import { UtilitiesService } from './_services/utilities.service';
import { SpinnerComponentModule } from 'ng2-component-spinner';
import { DashboardComponent } from './components/profile/dashboard/dashboard.component';
import { StorageService } from './_services/storage.service';
import { TripdetailComponent } from './components/trips/tripdetail/tripdetail.component';
import { MessagesComponent } from './components/profile/messages/messages.component';
import { ApiService } from './_services/api.service';

registerLocaleData(it);
const googleMapsAPIKey = 'AIzaSyCb2-mkLHWGdDBQAchtHhuQcucgbPNuO-M';

const sitemap = [{
  path: '',
  component: BodyComponent
}, {
  path: 'signup',
  component: SignupComponent
}, {
  path: 'myprofile/details',
  component: PersonaldetailsComponent,
}, {
  path: 'myprofile/mytrips',
  component: MytripsComponent,
}, {
  path: 'myprofile/offeredtrips',
  component: OfferedtripsComponent,
}, {
  path: 'myprofile/messages',
  component: MessagesComponent,
}, {
  path: 'dashboard',
  component: DashboardComponent,
}, {
  path: 'tripdetail',
  component: TripdetailComponent,
},  {
  path: 'adminpanel',
  component: AdminpanelComponent,
}, {
  path: 'findpassage',
  component: FindpassageComponent,
}, {
  path: 'newtrip/pathchooser',
  component: PathchooserComponent,
}, {
  path: 'newtrip/pricechooser',
  component: PricechooserComponent,
}, {
  path: '**',
  component: PagenotfoundComponent
}];

// enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    SignupComponent,
    PathchooserComponent,
    AdminpanelComponent,
    PricechooserComponent,
    PagenotfoundComponent,
    MytripsComponent,
    PersonaldetailsComponent,
    SidebarComponent,
    FindpassageComponent,
    OfferedtripsComponent,
    ApiAutocompleteComponent,
    TripabstractComponent,
    DashboardComponent,
    TripdetailComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NguiAutoCompleteModule,
    NgbModule,
    SlideMenuModule,
    NouisliderModule,
    Ng2PaginationModule,
    SpinnerComponentModule,
    NgbModule.forRoot(),
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
    ConstantsService,
    NgbModalStack,
    NgbDropdownConfig,
    NgbCalendarGregorian,
    PaginationService,
    UtilitiesService,
    StorageService,
    ApiService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
