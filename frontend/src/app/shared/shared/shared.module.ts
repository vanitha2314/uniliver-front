import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeViewComponent } from '../components/tree-view/tree-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportComponent } from '../components/report/report.component';
import { TableTreeComponent } from '../components/table-tree/table-tree.component';
import { CustomDecimalPipePipe } from '../pipes/custom-decimal-pipe.pipe';
import { DialogComponent } from '../components/dialog/dialog.component';
@NgModule({
  declarations: [TreeViewComponent, ReportComponent, TableTreeComponent,CustomDecimalPipePipe, DialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TreeViewComponent,
    ReportComponent,
    NgSelectModule,
    CustomDecimalPipePipe,

  ],
  entryComponents: [
    DialogComponent
  ],
  providers:[CustomDecimalPipePipe,DecimalPipe]

})
export class SharedModule {}
