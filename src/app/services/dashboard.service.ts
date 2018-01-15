import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';
import { BaseService } from "./base.service";

/** 
 * ROPC Farm service. 
 */
@Injectable() export class DashboardService extends BaseService {

    constructor(private _http: HttpService) {
        super(_http);
        this.path = 'dashboard';
    }

    public getDashboard(): Observable<any> {
        return this.http.get(`${this.path}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
}  