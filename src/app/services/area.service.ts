import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';
import { BaseService } from './base.service';

/**
 * ROPC Farm service.
 */
@Injectable() export class AreaService extends BaseService {

    constructor(private _http: HttpService) {
        super(_http);
        this.path = 'areas';
    }

    /**
     * search areas
     * @param params
     */
    public search(params: URLSearchParams): Observable<any> {
        return this.http.get(`${this.path}`, { search: params })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * search areas
     * @param farmId
     */
    public getByFarm(farmId: string): Observable<any> {
        return this.http.get(`${this.path}/by-farms/${farmId}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
}
