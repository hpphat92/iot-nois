import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalState } from '../../../global.state';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop implements OnInit {
  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;
  public avatarUrl: string;

  constructor(private _state: GlobalState,
    private router: Router,
    private authService: AuthService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  ngOnInit(): void {
    var user = this.authService.getUserFromStorage();
    this.avatarUrl = user.avatarUrl;
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public onSubmit(values: Object): void {
    this.authService.signout();
    // this.router.navigateByUrl('/login');
  }
}
