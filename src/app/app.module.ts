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
import { DetailsComponent } from './components/profile/details/details.component';
import { HeaderComponent } from './components/baselayout/header/header.component';
import { FooterComponent } from './components/baselayout/footer/footer.component';
import { SharedComponent } from './_services/shared';
import { ReactiveFormsModule } from '@angular/forms';
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
import { CityautocompleteComponent } from './components/shared/cityautocomplete/cityautocomplete.component';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { TripabstractComponent } from './components/shared/tripabstract/tripabstract.component';
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
import { UtilitiesService } from './_services/utilities.service';
import { SpinnerComponentModule } from 'ng2-component-spinner';

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
  component: DetailsComponent,
}, {
  path: 'myprofile/mytrips',
  component: MytripsComponent,
}, {
  path: 'myprofile/offeredtrips',
  component: OfferedtripsComponent,
}, {
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
    DetailsComponent,
    FindpassageComponent,
    OfferedtripsComponent,
    CityautocompleteComponent,
    TripabstractComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
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
    UtilitiesService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
