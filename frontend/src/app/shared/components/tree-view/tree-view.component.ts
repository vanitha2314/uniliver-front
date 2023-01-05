import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportComponent } from '../report/report.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { Modal } from 'bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
  @Input('tree') tree = [];
  shareForm: FormGroup;
  @Output() selectFile: EventEmitter<any> = new EventEmitter<any>();
  private unSubscribe: Subject<void> = new Subject();
  @Output() onFileDownload: EventEmitter<string> = new EventEmitter<string>();
  private pivotFileData = {} as { containerName: string; filePath: string };
  expand: boolean = false;
  dataForm: FormGroup;
  selectedFile: string;
  selectedPivotFile: any;
  pivotSelectedFile: string;
  user: any;
  users: any[] = [];
  containerData:any;
  firstName: string[] = [];
  constructor(
    private reportService: ReportsService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private report: ReportComponent,
    private toast: ToastrService,
  ) {}

  shareModal: Modal;
  @ViewChild('shareModalRef') shareModalRef: ElementRef;

  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    this.createShareForm();
    this.reportService.onPivotFileDataChange$
    .pipe(takeUntil(this.unSubscribe))
    .subscribe((res) => {
      this.pivotFileData = res;
    });
  }

  handleSelection(filePath: string, node: any) {
    this.containerData = {
      containerName: node.node,
      filePath: `${filePath}`,
    };
    if (node.nodeType === 'container') {
      this.selectFile.emit({
        container: this.containerData.containerName,
        name: this.containerData.containerName,
        path: `${node.node}/${this.containerData.filePath}`,
      });
      
    } else {
      this.selectFile.emit(`${node.node}/${filePath}`);
    }
  }

  onSelect(filePath: string) {
    this.selectFile.emit(filePath);
  }
  onShare(file: any) {
    this.selectedPivotFile = file;
    this.getAllUser();
    this.shareModal = new Modal(this.shareModalRef.nativeElement, {});
    this.shareModal.show();
    this.createShareForm();
  }
  getAllUser() {
    this.spinner.show();
    this.reportService.getAllUsers(this.user?.id).subscribe(
      (res) => {
        this.spinner.hide();
        if (res?.status === 200 && res?.data) {
          this.users = res.data;
          // this.users.map((item) =>{
          //   // if (item.hasOwnProperty('firstName')) {
          //   //   // this.firstName.push(item.firstName);
          //   // }
          //   this.firstName =item.firstName.split();
          // })
        }
      },
      (err) => {
        this.spinner.hide();
        console.error(err);
      }
    );
  }
  toggleExpand() {
    this.expand = !this.expand;
  }
  downloadFile() {
    const data ={
      filePath:this.pivotFileData.filePath,
    }
    this.reportService
      .downloadAdlsFile(this.pivotFileData.containerName,data)
      .then(
        (res) => {
          let blob: any = new Blob([res], { type: 'text/csv, charset=UTF-8' });
          const url = window.URL.createObjectURL(blob);

          fileSaver.saveAs(blob, `${data?.filePath}`);
        },
        (error) => {}
      );
  }
  deleteFile(index: any) {
    const data ={
      containerName:this.pivotFileData.containerName,
      filePath:this.pivotFileData.filePath,
    }
   
    this.spinner.show();

    this.reportService.deletePivot(data).subscribe((res) =>{
      if (res.status === 200){
     this.spinner.hide();
     this.tree.splice(index, 1);
      this.toast.success('Pivot file deleted successfully ');
      console.log(res)
      }
 
    }, error => {
      this.spinner.hide();
      console.log(error?.message || 'error in deleteFile');
    })
  }
  shareUser(){
    return this.shareForm.controls
  }
  sharePivotFile() {
    const data = {
      containerName: this.pivotFileData.containerName,
      filePath: this.pivotFileData.filePath,
      users: this.shareUser().users.value,
    };
    console.clear();
 
    this.spinner.show();
    this.reportService.sharePivot(data).subscribe((res) =>{
      if (res.status === 200){
 this.spinner.hide();
      this.toast.success('Pivot file shared successfully ');
      }
     
      // console.log(res)
    }, error => this.spinner.hide());
  }
  createShareForm() {
    this.shareForm = this.fb.group({
      users: [[], [Validators.required, Validators.maxLength]],
    });
  }
}
