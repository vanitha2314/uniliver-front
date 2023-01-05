import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { HomeComponent } from 'src/app/modules/main/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { MyPivotTableComponent } from './my-pivot-table/my-pivot-table.component';
import { PivotResultComponent } from './pivot-result/pivot-result.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        // canActivate: [MsalGuard]
      },
      {
        path: 'dashboard',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'saved-queries',
        loadChildren: () =>
          import('./saved-queries/saved-queries.module').then(
            (m) => m.SavedQueriesModule
          ),
      },
      {
        path: 'summary',
        loadChildren: () =>
          import('./summary/summary.module').then((m) => m.SummaryModule),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'upload',
        loadChildren: () =>
          import('./upload-file/upload-file.module').then(
            (m) => m.UploadFileModule
          ),
      },
      {
        path: 'mypivot',
        component: MyPivotTableComponent
      },
      {
        path: 'pivotresult',
        component: PivotResultComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
