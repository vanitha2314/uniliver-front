import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportEditComponent } from './report-edit/report-edit.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: ':tab',
    component: ReportsComponent,
  },
  {
    path: 'details/:type/:id',
    component: ReportEditComponent,
  },
  {
    path: '**',
    redirectTo: 'createdByMe'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
