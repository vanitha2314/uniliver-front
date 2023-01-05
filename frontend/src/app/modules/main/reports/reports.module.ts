import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportEditComponent } from './report-edit/report-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ReportsComponent, ReportEditComponent],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
