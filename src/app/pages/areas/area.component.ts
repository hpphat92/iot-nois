import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Util, FarmService, AreaService } from '../../services/index';
import { CreateOrUpdateAreaComponent } from "./create-or-update/create-or-update.component";
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'area',
  styleUrls: ['./area.scss'],
  templateUrl: './area.html'
})
export class Area {

  private data: any;
  private pagingInfo: any;

  constructor(private _modalService: NgbModal, private _farmService: FarmService,
    private _util: Util, private _areaService: AreaService, private _translate: TranslateService, ) {
    this.data = { total: 0, areas: [] };
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
    this._areaService.search(params).subscribe(resp => {
      this.data = resp.data;
    });
  }

  /**
   * Show modal add farm
   */
  public showModalAddArea() {
    this._farmService.getAll().subscribe(farmResp => {
      let modalRef = this._modalService.open(CreateOrUpdateAreaComponent, { backdrop: 'static', size: 'lg', keyboard: false });
      modalRef.componentInstance.title = "Add New Area";
      modalRef.componentInstance.farms = farmResp.data;
      modalRef.result.then(data => {
        if (data) {
          this.refreshData();
        }
      }, (err) => { });
    });
  }

  /**
   * Show modal edit area
   * @param id 
   */
  public showModalEditArea(id: string): void {
    this._areaService.getById(id).subscribe(areaResp => {
      this._farmService.getAll().subscribe(farmResp => {
        let modalRef = this._modalService.open(CreateOrUpdateAreaComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modalRef.componentInstance.title = "Update Farm";
        modalRef.componentInstance.area = areaResp.data;
        modalRef.componentInstance.farms = farmResp.data;
        modalRef.result.then(data => {
          if (data) {
            this.refreshData();
          }
        }, (err) => { });
      });
    });
  }

  /**
   * delete an area by id
   * @param id 
   */
  public deleteArea(id: string): void {
    this._translate.get('modal.delete_area').subscribe((msg: string) => {
      let modalRef = this._modalService.open(ConfirmDialogComponent, {
        keyboard: true,
        backdrop: 'static'
      });
      modalRef.componentInstance.title = "Delete Area";
      modalRef.componentInstance.message = msg;
      modalRef.componentInstance.btnOk = "Delete";
      modalRef.result.then((result: boolean) => {
        if (result) {
          this._areaService.delete(id).subscribe(resp => {
            this.refreshData();
          });
        }
      }, (err) => { });
    });
  }
}
