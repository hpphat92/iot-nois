import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Request,
  Headers,
  XHRBackend,
  QueryEncoder,
} from '@angular/http';
import { Router } from '@angular/router';
import { AngularReduxRequestOptions } from './angular-redux-request.options';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AppSetting } from '../app.setting';

@Injectable()
export class HttpService extends Http {

  constructor(backend: XHRBackend,
              defaultOptions: AngularReduxRequestOptions,
              private slimLoadingBarService: SlimLoadingBarService,
              private toastr: ToastsManager,
              private router: Router) {
    super(backend, defaultOptions);
  }

  public get(url: string, options?: RequestOptionsArgs, showNotify?: boolean): Observable<any> {
    this.showLoader();

    return super.get(this.getFullUrl(url), this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res, showNotify);
      }, (error: any) => {
        this.onError(error, showNotify);
      })
      .finally(() => {
        this.onEnd();
      });

  }

  public post(url: string, body: any, options?: RequestOptionsArgs, showNotify?: boolean): Observable<any> {
    this.showLoader();
    return super.post(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res, showNotify);
      }, (error: any) => {
        this.onError(error, showNotify);
      })
      .finally(() => {
        this.onEnd();
      });

  }

  public put(url: string, body: any, options?: RequestOptionsArgs, showNotify?: boolean): Observable<any> {
    this.showLoader();
    return super.put(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res, showNotify);
      }, (error: any) => {
        this.onError(error, showNotify);
      })
      .finally(() => {
        this.onEnd();
      });

  }

  public delete(url: string, options?: RequestOptionsArgs, showNotify?: boolean): Observable<any> {
    this.showLoader();
    return super.delete(this.getFullUrl(url), this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res, showNotify);
      }, (error: any) => {
        this.onError(error, showNotify);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  public signout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    // if (options === null) {
    //     options = new AngularReduxRequestOptions(options);
    // }

    options = new AngularReduxRequestOptions(options);
    if (options.headers === null) {
      options.headers = new Headers();
    }

    return options;
  }

  private getFullUrl(url: string): string {
    return AppSetting.API_ENDPOINT + url;
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private onSuccess(res: Response, showNotify?: boolean): void {
    if (showNotify && res.status === 200 || res.status === 201) {
      const body = JSON.parse(res.text());
      this.toastr.success(body.message, 'Success');
    }
  }

  private onError(res: Response, showNotify?: boolean): void {
    if (res.status === 0) {
      this.toastr.error('Cannot connect to server', 'Error');
    } else if (res.status === 400 || res.status === 404) {
      const body = JSON.parse(res.text());
      this.toastr.error(body.message, 'Error');
    } else if (res.status === 401) {
      this.toastr.error('Must login', 'Error');
      this.signout();
    } else if (res.status === 500) {
      const body = JSON.parse(res.text());
      this.toastr.error(body.message, 'Error');
    }
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.slimLoadingBarService.start();
  }

  private hideLoader(): void {
    this.slimLoadingBarService.complete();
  }
}

export class MyQueryEncoder extends QueryEncoder {
  public encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  public encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
}
