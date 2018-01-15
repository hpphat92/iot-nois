import { Component } from '@angular/core';

import { DashboardService } from '../../services/index';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {

  private data: any;

  constructor(private _dashboardService: DashboardService) {
  }

  public ngOnInit(): void {
    this._dashboardService.getDashboard().subscribe(resp => {
      this.data = resp.data;
      console.log(this.data);
    });
  }

}
