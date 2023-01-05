import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { AddEditModalComponent } from './add-edit-modal/add-edit-modal.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    UserManagementComponent,
    AddEditModalComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ]
})
export class UserManagementModule { }
