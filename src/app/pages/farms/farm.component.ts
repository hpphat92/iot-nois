import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Util, UserService, FarmService } from '../../services/index';
import { CreateOrUpdateFarmComponent } from "./create-or-update/create-or-update.component";
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'farm',
  styleUrls: ['./farm.scss'],
  templateUrl: './farm.html'
})
export class Farm {

  private data: any;
  private pagingInfo: any;

  constructor(private _userService: UserService, private _farmService: FarmService, private _modalService: NgbModal,
    private _translate: TranslateService, private _util: Util, ) {
    this.data = { total: 0, farms: [] };
    this.pagingInfo = { pageIndex: 1, pageSize: 10 };
  }

  public ngOnInit(): void {
    // this.frm = this._fb.group({
    //   firstName: [''],
    //   lastName: [''],
    //   email: [''],
    //   // phone: [''],
    //   sortBy: [''],
    //   descending: ['false']
    // });

    this.refreshData();
  }

  public refreshData(): void {
    let obj = {
      // ...this.frm.value,
      pageIndex: this.pagingInfo.pageIndex,
      pageSize: this.pagingInfo.pageSize
    }
    let params = this._util.objectToURLSearchParams(obj);
    this._farmService.search(params).subscribe(resp => {
      this.data = resp.data;
    });
  }

  /**
   * Show modal add farm
   */
  public showModalAddFarm() {
    this._userService.getAll().subscribe(userResp => {
      let modalRef = this._modalService.open(CreateOrUpdateFarmComponent, { backdrop: 'static', size: 'lg', keyboard: false });
      modalRef.componentInstance.title = "Add New Farm";
      modalRef.componentInstance.users = userResp.data;
      modalRef.result.then(data => {
        if (data) {
          this.refreshData();
        }
      }, (err) => { });
    });
  }

  /**
   * Show modal edit user
   * @param id 
   */
  public showModalEditFarm(id: string): void {
    this._farmService.getById(id).subscribe(farmResp => {
      this._userService.getAll().subscribe(userResp => {
        let modalRef = this._modalService.open(CreateOrUpdateFarmComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modalRef.componentInstance.title = "Update Farm";
        modalRef.componentInstance.farm = farmResp.data;
        modalRef.componentInstance.users = userResp.data;
        modalRef.result.then(data => {
          if (data) {
            this.refreshData();
          }
        }, (err) => { });
      });
    });
  }

  /**
   * delete a farm by id
   * @param id 
   */
  public deleteFarm(id: string): void {
    this._translate.get('modal.delete_farm').subscribe((msg: string) => {
      let modalRef = this._modalService.open(ConfirmDialogComponent, {
        keyboard: true,
        backdrop: 'static'
      });
      modalRef.componentInstance.title = "Delete Farm";
      modalRef.componentInstance.message = msg;
      modalRef.componentInstance.btnOk = "Delete";
      modalRef.result.then((result: boolean) => {
        if (result) {
          this._farmService.delete(id).subscribe(resp => {
            this.refreshData();
          });
        }
      }, (err) => { });
    });
  }
}
