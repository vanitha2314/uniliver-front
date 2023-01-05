import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadFileRoutingModule } from './upload-file-routing.module';
import { UploadFileComponent } from './upload-file.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [UploadFileComponent],
  imports: [CommonModule, UploadFileRoutingModule, SharedModule],
})
export class UploadFileModule {}
