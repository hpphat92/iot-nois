import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';
import { BaseService } from './base.service';

/**
 * ROPC User service.
 */
@Injectable() export class UserService extends BaseService {

    constructor(private _http: HttpService) {
        super(_http);
        this.path = 'users';
    }

    public search(params: URLSearchParams): Observable<any> {
        return this.http.get(`${this.path}`, { search: params })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Get all user for dropdown list
     */
    public getAll(): Observable<any> {
        return this.http.get(`${this.path}/all`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // /**
    //  * get list user
    //  * @param keySearch
    //  * @param pageIndex
    //  * @param pageSize
    //  */
    // public get(keySearch: string, pageIndex: number, pageSize: number): Observable<any> {
    //     return this.http.get(`${this.PREFIX_API}?KeySearch=${keySearch}&PageIndex=${pageIndex}&PageSize=${pageSize}`)
    //         .map((res: Response) => {
    //             let body: any = res.json();
    //             return body.data;
    //         }).catch((error: any) => {
    //             // Error on post request.
    //             return Observable.throw(error);
    //         });
    // }

    // /**
    //  * get detail user
    //  * @param id
    //  */
    // public detail(id: string): Observable<any> {
    //     return this.http.get(`${this.PREFIX_API}/${id}`)
    //         .map((res: Response) => {
    //             let body: any = res.json();
    //             return body.data;
    //         }).catch((error: any) => {
    //             // Error on post request.
    //             return Observable.throw(error);
    //         });
    // }

    // /**
    //  * add new user
    //  * @param user
    //  */
    // public add(user: any): Observable<any> {
    //     return this.http.post(this.PREFIX_API, JSON.stringify(user), null, true)
    //         .catch((error: any) => {
    //             // Error on post request.
    //             return Observable.throw(error);
    //         });
    // }

    // /**
    //  * update user
    //  * @param user
    //  */
    // public update(user: any): Observable<any> {
    //     return this.http.put(`${this.PREFIX_API}/${user.id}`, JSON.stringify(user), null, true)
    //         .catch((error: any) => {
    //             // Error on post request.
    //             return Observable.throw(error);
    //         });
    // }

    // /**
    //  * delete an user by id
    //  * @param userId
    //  */
    // public delete(userId: string): Observable<any> {
    //     return this.http.delete(`${this.PREFIX_API}/${userId}`, null, true)
    //         .catch((error: any) => {
    //             // Error on post request.
    //             return Observable.throw(error);
    //         });
    // }

    // /**
    //  * get list users for dropdown list
    //  */
    // public getForDropdown(): Observable<any> {
    //     return this.http.get(`${this.PREFIX_API}/list-for-dropdown`)
    //         .map((res: Response) => {
    //             let body: any = res.json();
    //             return body.data;
    //         }).catch((error: any) => {
    //             // Error on post request.
    //             return Observable.throw(error);
    //         });
    // }
}
