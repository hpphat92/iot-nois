import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';
import { BaseService } from "./base.service";

/** 
 * ROPC Sensor service. 
 */
@Injectable() export class SensorService extends BaseService {

    constructor(private _http: HttpService) {
        super(_http);
        this.path = 'sensors';
    }

    public search(params: URLSearchParams): Observable<any> {
        return this.http.get(`${this.path}`, { search: params })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * get all types
     */
    public getTypes(): Observable<any> {
        return this.http.get(`${this.path}/types`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * get all types
     */
    public getTimeData(id: string, data: any): Observable<any> {
        return this.http.post(`${this.path}/${id}/data`, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
}  