import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedQueriesRoutingModule } from './saved-queries-routing.module';
import { SavedQueriesComponent } from './saved-queries.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [SavedQueriesComponent],
  imports: [CommonModule, SavedQueriesRoutingModule, SharedModule],
})
export class SavedQueriesModule {}
