import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';

/** 
 * ROPC Profile service. 
 */
@Injectable() export class ProfileService {

    private PREFIX_API = "/profiles";
    private headers: Headers;
    private options: RequestOptions;

    constructor(private http: HttpService) {

        // Creates header for post requests.  
        // this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        // this.options = new RequestOptions({ headers: this.headers });

    }

    /** 
     * Tries to sign in the user. 
     * 
     * @return The user's data 
     */
    public get(): Observable<any> {
        return this.http.get(this.PREFIX_API, this.options, false)
            .map((res: Response) => {
                let body: any = res.json();
                localStorage.setItem("user", JSON.stringify(body.data));
            }).catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }

    /**
     * Update profile
     * @param profile 
     */
    public put(profile: any): Observable<any> {
        return this.http.put(this.PREFIX_API, JSON.stringify(profile), null, true)
            .catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }

    /**
     * Change passowrd
     * @param passwordModel
     */
    public changePassword(passowrdModel: any): Observable<any> {
        return this.http.put(`${this.PREFIX_API}/change-password`, JSON.stringify(passowrdModel), null, true)
            .catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }
}  