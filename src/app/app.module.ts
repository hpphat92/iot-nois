import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XHRBackend, HttpModule, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { CoreModule } from './core/core.module';
import { AuthGuard, AuthService, UserService, ProfileService, Util, FarmService, AreaService, SensorService, DashboardService, HubService } from './services/index';
import { TempHumidityChartModule } from "./shared/components/temp-humidity-chart/temp-humidity-chart.module";
import { AtmosphericChartModule } from "./shared/components/atmospheric-chart/atmospheric-chart.module";
// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  AuthGuard,
  AuthService,
  ProfileService,
  UserService,
  Util,
  FarmService,
  AreaService,
  SensorService,
  DashboardService,
  HubService,
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing,
    CoreModule,
    TempHumidityChartModule,
    AtmosphericChartModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
