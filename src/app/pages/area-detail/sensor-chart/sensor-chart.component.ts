import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sensor-chart-farm',
    styleUrls: [('./sensor-chart.component.scss')],
    templateUrl: './sensor-chart.component.html'
})

export class SensorChartModalComponent {
    public sensor: any = null;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() {
        console.log(this.sensor);
    }

    closeModal() {
        this.activeModal.close();
    }
}