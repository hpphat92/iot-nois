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
@Injectable() export class FarmService extends BaseService {

    constructor(private _http: HttpService) {
        super(_http);
        this.path = 'farms';
    }

    public search(params: URLSearchParams): Observable<any> {
        return this.http.get(`${this.path}`, { search: params })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAll(): Observable<any> {
        return this.http.get(`${this.path}/all`)
            .map(this.extractData)
            .catch(this.handleError);
    }
}  