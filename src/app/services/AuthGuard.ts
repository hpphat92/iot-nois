import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/** 
 * Decides if a route can be activated. 
 */
@Injectable() export class AuthGuard implements CanActivate {

    constructor(public authService: AuthService, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.authService.isLoggedIn() == "true") {
            // Signed in.  
            return true;
        }
       
        // Stores the attempted URL for redirecting.  
        let url: string = state.url;
        this.authService.redirectUrl = url;
        // Not signed in so redirects to signin page.  
        this.router.navigate(['/login']);
        return false;
    }
}  