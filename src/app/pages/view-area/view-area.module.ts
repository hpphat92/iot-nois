import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { LeafletModule } from '../../../../leaflet/leaflet.module';

import { ViewAreaComponent } from './view-area.component';
import { routing } from './view-area.routing';

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
    ViewAreaComponent,
  ],
  providers: [
  ],
})
export class ViewAreaModule { }
