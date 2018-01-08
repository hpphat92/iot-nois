import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { HttpService } from '../core/http.service';

/** 
 * ROPC User service. 
 */
@Injectable() export class PostService {
    // post prefix route
    private PREFIX_API = "/posts";
}  