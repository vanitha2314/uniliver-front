import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedQueriesComponent } from './saved-queries.component';

const routes: Routes = [
  {
    path: ':tab',
    component: SavedQueriesComponent,
  },

  // {
  //   path: 'details/:type/:id',
  //   component: SavedEditComponent,
  // },
  {
    path: '**',
    redirectTo: 'savedByMe'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedQueriesRoutingModule {}
