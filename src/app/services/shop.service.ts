import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';

/** 
 * ROPC Shop service. 
 */
@Injectable() export class ShopService {

    private PREFIX_API = "/shops";

    constructor(private http: HttpService) { }

    /**
     * get list shop
     * @param keySearch 
     * @param pageIndex 
     * @param pageSize 
     */
    public get(keySearch: string, pageIndex: number, pageSize: number): Observable<any> {
        return this.http.get(`${this.PREFIX_API}?KeySearch=${keySearch}&PageIndex=${pageIndex}&PageSize=${pageSize}`)
            .map((res: Response) => {
                let body: any = res.json();
                return body.data;
            }).catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }

    /**
     * get detail
     * @param id
     */
    public detail(id: string): Observable<any> {
        return this.http.get(`${this.PREFIX_API}/${id}`)
            .map((res: Response) => {
                let body: any = res.json();
                return body.data;
            }).catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }

    /**
     * add new shop
     * @param shop 
     */
    public add(shop: any): Observable<any> {
        return this.http.post(this.PREFIX_API, JSON.stringify(shop))
            .catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }

    /**
     * update shop
     * @param shop 
     */
    public update(shop: any): Observable<any> {
        return this.http.put(`${this.PREFIX_API}/${shop.id}`, JSON.stringify(shop), null, true)
            .catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }

    /**
     * get list users for dropdown list
     */
    public getForDropdown(): Observable<any> {
        return this.http.get(`${this.PREFIX_API}/list-for-dropdown`)
            .map((res: Response) => {
                let body: any = res.json();
                return body.data;
            }).catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }


    /**
     * delete a shop by id
     * @param shopId 
     */
    public delete(shopId: string): Observable<any> {
        return this.http.delete(`${this.PREFIX_API}/${shopId}`, null, true)
            .catch((error: any) => {
                // Error on post request.  
                return Observable.throw(error);
            });
    }
}  