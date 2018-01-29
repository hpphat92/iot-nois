import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { LeafletModule } from '../../../../leaflet/leaflet.module';

import { AreaDetail } from './area-detail.component';
import { routing } from './area-detail.routing';
import { CreateOrUpdateSensorComponent } from "../sensors/create-or-update/create-or-update.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    LeafletModule.forRoot(),
    routing,
  ],
  declarations: [
    AreaDetail,
  ],
  providers: [
  ],
})
export class AreaDetailModule { }
