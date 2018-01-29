import { XHRBackend } from '@angular/http';
import { AngularReduxRequestOptions } from '../core/angular-redux-request.options';
import { HttpService } from '../core/http.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

function httpServiceFactory(backend: XHRBackend,
    options: AngularReduxRequestOptions,
    slimLoadingBarService: SlimLoadingBarService,
    toastsManager: ToastsManager,
    router: Router) {
    return new HttpService(backend, options, slimLoadingBarService, toastsManager, router);
}

export { httpServiceFactory };
