import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XHRBackend, RequestOptions } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { httpServiceFactory } from '../factories/http-service.factory';
import { AngularReduxRequestOptions } from './angular-redux-request.options';
import { SlimLoadingBarService, SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ToastsManager, ToastModule } from 'ng2-toastr/ng2-toastr';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        SlimLoadingBarModule.forRoot(),
        BrowserAnimationsModule,
        ToastModule.forRoot(),
    ],
    exports: [
        BrowserModule, SlimLoadingBarModule, ToastModule,
    ],
    declarations: [
    ],
    providers: [
        SlimLoadingBarService,
        {
            provide: HttpService,
            useFactory: httpServiceFactory,
            deps: [XHRBackend, RequestOptions, SlimLoadingBarService, ToastsManager, Router]
        },
    ]
})

export class CoreModule { }
