import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { UserService, Util, FarmService } from '../../services/index';
import { CreateOrUpdateUserComponent } from "./create-or-update/create-or-update.component";
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'user',
  styleUrls: ['./user.scss'],
  templateUrl: './user.html'
})
export class User {

  private frm: FormGroup;
  public sortByList: any;
  private data: any;
  private pagingInfo: any;

  constructor(private _userService: UserService, private _util: Util, private _fb: FormBuilder,
    private _farmService: FarmService, private _translate: TranslateService,
    private _modalService: NgbModal) {
    this.data = { total: 0, users: [] };
    this.pagingInfo = { pageIndex: 1, pageSize: 10 };
  }

  public ngOnInit(): void {
    this.frm = this._fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      sortBy: [''],
      ascending: ['true']
    });

    this._userService.getSortByList().subscribe(resp => {
      this.sortByList = resp.data;
      if (this.sortByList.length) {
        this.frm.patchValue({ sortBy: this.sortByList[0].key });
      }
      this.refreshData();
    });
  }

  public onSubmit(): void {
    this.pagingInfo.pageIndex = 1;
    this.refreshData();
  }

  public refreshData(): void {
    let obj = {
      ...this.frm.value,
      pageIndex: this.pagingInfo.pageIndex,
      pageSize: this.pagingInfo.pageSize
    }
    let params = this._util.objectToURLSearchParams(obj);
    this._userService.search(params).subscribe(resp => {
      this.data = resp.data;
    });
  }

  /**
   * Show modal add user
   */
  public showModalAddUser() {
    this._farmService.getAll().subscribe(farmResp => {
      let modalRef = this._modalService.open(CreateOrUpdateUserComponent, { backdrop: 'static', size: 'lg', keyboard: false });
      modalRef.componentInstance.title = "Add New User";
      modalRef.componentInstance.farms = farmResp.data;
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
  public showModalEditUser(id: string): void {
    this._userService.getById(id).subscribe(userResp => {
      this._farmService.getAll().subscribe(farmResp => {
        let modalRef = this._modalService.open(CreateOrUpdateUserComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modalRef.componentInstance.title = "Update User";
        modalRef.componentInstance.user = userResp.data;
        modalRef.componentInstance.farms = farmResp.data;
        modalRef.result.then(data => {
          if (data) {
            this.refreshData();
          }
        }, (err) => { });
      });
    });
  }

  public deleteUser(id: string): void {
    this._translate.get('modal.delete_user').subscribe((msg: string) => {
      let modalRef = this._modalService.open(ConfirmDialogComponent, {
        keyboard: true,
        backdrop: 'static'
      });
      modalRef.componentInstance.title = "Delete User";
      modalRef.componentInstance.message = msg;
      modalRef.componentInstance.btnOk = "Delete";
      modalRef.result.then((result: boolean) => {
        if (result) {
          this._userService.delete(id).subscribe(resp => {
            this.refreshData();
          });
        }
      }, (err) => { });
    });
  }

}
