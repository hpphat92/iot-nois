import {
    Component,
    Input,
} from '@angular/core';

import {
    NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
    @Input()
    public title: string;

    @Input()
    public message: string;

    @Input()
    public btnOk: string;

    @Input()
    public btnCancel: string;

    constructor(public activeModal: NgbActiveModal) { }
}