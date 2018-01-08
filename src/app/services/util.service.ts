import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { isObject } from 'util';

import { MyQueryEncoder } from '../core/http.service';

@Injectable()
export class Util {

    constructor(private _http: Http) {

    }

    public getFullRoutePath(suffix, route: ActivatedRouteSnapshot) {
        if (route.routeConfig && route.routeConfig.path) { // If the path not empty
            suffix = `${route.routeConfig.path}/${suffix}`;
        }
        if (route.parent) { // If it still has parent
            return this.getFullRoutePath(suffix, route.parent);
        }
        return '/' + suffix;
    }

    public getFullRoutePathByActivatedRoute(suffix, route: ActivatedRoute) {
        if (route.routeConfig && route.routeConfig.path) { // If the path not empty
            suffix = `${route.routeConfig.path}/${suffix}`;
        }
        if (route.parent) { // If it still has parent
            return this.getFullRoutePathByActivatedRoute(suffix, route.parent);
        }
        return '/' + suffix;
    }

    public getLastActivatedRoute(route: ActivatedRoute) {
        while (route.firstChild) {
            route = route.firstChild;
        }

        return route;
    }

    public objectToParams(object): string {
        return Object.keys(object).map((key) => isObject(object[key]) ?
            this.subObjectToParams(encodeURIComponent(key), object[key]) :
            `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
        ).join('&');
    }

    /**
     * Converts a sub-object to a parametrised string.
     * @param object
     * @returns {string}
     */
    public subObjectToParams(key, object): string {
        return Object.keys(object).map((childKey) => isObject(object[childKey]) ?
            this.subObjectToParams(`${key}[${encodeURIComponent(childKey)}]`, object[childKey]) :
            `${key}[${encodeURIComponent(childKey)}]=${encodeURIComponent(object[childKey])}`
        ).join('&');
    }

    public guid() {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    public objectToURLSearchParams(object): URLSearchParams {
        let params = new URLSearchParams('', new MyQueryEncoder());
        _.forEach(object, (value, key) => {
            params.set(key, value);
        });
        return params;
    }

    public matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({ notMatch: true })
            } else {
                return passwordConfirmationInput.setErrors(null);
            }
        }
    }

    public getFilename(url): string {
        if (!url) {
            return null;
        }
        return url.substring(url.lastIndexOf('/') + 1);
    }
}
