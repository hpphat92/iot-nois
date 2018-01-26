import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { HttpService } from '../core/http.service';

/**
 * ROPC Authentication service.
 */
@Injectable()
export class AuthService {

  /**
   * Stores the URL so we can redirect after signing in.
   */
  public redirectUrl: string;
  private headers: Headers;
  private options: RequestOptions;

  private PREFIX_API = 'accounts';

  constructor(private http: HttpService) {

    // Creates header for post requests.
    this.headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    this.options = new RequestOptions({headers: this.headers});

  }

  public signup(data: any): Observable<any> {
    return this.http.post(`${this.PREFIX_API}/signup`, data)
      .map(resp => {
        const body = resp.json();
        return body || {};
      })
      .catch(error => {
        return Observable.throw(error.json());
      });
  }

  /**
   * Tries to sign in the user.
   *
   * @param email
   * @param password
   * @return The user's data
   */
  public signin(email: string, password: string): Observable<any> {
    // params.
    const params: any = {
      email,
      password,
    };

    // Encodes the parameters.
    const formData: string = this.encodeParams(params);

    return this.http.post(`${this.PREFIX_API}/token`, formData, this.options, false)
      .map((res: Response) => {

        const body: any = res.json();

        // Sign in successful if there's an access token in the response.
        if (typeof body.access_token !== 'undefined') {

          // Stores access token & refresh token.
          this.store(body);

        }

      }).catch((error: any) => {

        // Error on post request.
        return Observable.throw(error);

      });

  }

  public signout(): void {
    this.http.signout();
  }

  /**
   * // Encodes the parameters.
   *
   * @param params The parameters to be encoded
   * @return The encoded parameters
   */
  private encodeParams(params: any): string {

    let body: string = '';
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (body.length) {
          body += '&';
        }
        body += `${key}=`;
        body += encodeURIComponent(params[key]);
      }
    }

    return body;
  }

  /**
   * Stores access token & refresh token.
   *
   * @param body The response of the request to the token endpoint
   */
  private store(body: any): void {
    // Stores access token in local storage to keep user signed in.
    localStorage.setItem('access_token', body.access_token);
    localStorage.setItem('isLoggedIn', 'true');
  }

  public isLoggedIn() {
    return localStorage.getItem('isLoggedIn');
  }

  public getUserFromStorage() {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Check user is admin
   */
  public isAdmin() {
    const user = this.getUserFromStorage();
    return user.roles.includes('Admin');
  }

  /**
   * Reset password
   * @param resetPasswordModel
   */
  public resetPassword(resetPasswordModel: any): Observable<any> {
    return this.http.post(`${this.PREFIX_API}/reset-password`, JSON.stringify(resetPasswordModel), null, true)
      .catch((error: any) => {
        // Error on post request.
        return Observable.throw(error);
      });
  }

  public forgotPassword(model: any, step: string, showNotify: boolean) {
    return this.http.post(`${this.PREFIX_API}/forgot-password/${step}`, JSON.stringify(model), null, showNotify)
      .catch((error: any) => {
        // Error on post request.
        return Observable.throw(error);
      });
  }
}
