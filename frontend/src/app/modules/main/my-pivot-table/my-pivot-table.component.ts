import { Modal } from 'bootstrap';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  TemplateRef,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ReportsService } from './../../../services/reports.service';
import { AuthService } from './../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from 'src/app/services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-my-pivot-table',
  templateUrl: './my-pivot-table.component.html',
  styleUrls: ['./my-pivot-table.component.scss'],
})
export class MyPivotTableComponent implements OnInit {
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @ViewChild('statusPopUp') statusPopUp: ElementRef;
  data = [];
  value = 0;
  lasts:any;
  days:any;
  user: any;
  selectedPivot: any;
  refrshModal: Modal;
  @ViewChild('refreshModalRef')refreshModalRef:ElementRef;
  dataForm: FormGroup;
  constructor(
    public route: Router,
    public reportService: ReportsService,
    public authService: AuthService,
    private spinner: NgxSpinnerService,
    private mainService: MainService,
    private fb: FormBuilder,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    this.createdataForm();
    this.getPivotRequestData();
    this.lasts = new Array(12).fill(0).map((x, i) => i +1 );
    this.days=["Sunday","Monday", "Tuesday", "Wednesday", 
                  "Thursday", "Friday", "Saturday"];
  }
  showPivotResult(status: any) {
    if (status.status === 'Completed' ) {
      // bypass the condition
      const navigationExtras: NavigationExtras = {
        queryParams: {
          name: status.pivotTableName,
          // status: status.status,
          // id: status.id
        },
      };
      this.route.navigate(['/pivotresult'], navigationExtras);
    }
    // else
    else {
      const pivotstatus =
        status.status === 'Failed'
          ? ' Create new Pivot'
          : ' check after some time';

      this.mainService.openDialog(
        status.pivotTableName + ' status is ' + status.status + pivotstatus
      );
    }
  }

  getPivotRequestData() {
    this.spinner.show();
    this.reportService.getPivotRequestList(this.user?.id).subscribe(
      (res) => {
        if (res.status === 200) {
          this.data = res.data;
        }
        this.spinner.hide();
      },
      (error) => {
        console.log('getPivot responsest List', error);
        this.spinner.hide();
      }
    );
  }

  deleteTable(id: any) {
    this.spinner.show();
    this.reportService.deletePivotTable(id).subscribe(
      (res: any) => {
        if (res.status === 200) {
          const ind = this.data.findIndex((el: any) => el.id === id);
          this.data.splice(ind, 1);
          this.spinner.hide();
          this.mainService.openDialog(res.message);
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  
  // initializing FormControl
  createdataForm(){
    this.dataForm= this.fb.group({
      refreshmentType:['', Validators.required],
      date:[''],
      time:['', Validators.required],
      day:[''],
      median:['', Validators.required]
      })
  }
 
  refreshment(report:any){
    this.selectedPivot=report;
    this.refrshModal= new Modal(this.refreshModalRef.nativeElement,{})
    this.refrshModal.show()
  }
  selectSource() {
    // const source = this.dataForm.get('source')?.value;
    // console.log(source)
  }
  submitButton = false;
  onSchdules(){}
  onSchdule(){
  const data = this.dataForm.value;
    if ((data.refreshmentType !== '') &&
    ((data.refreshmentType == 'Weekly'  && data.day !=='' ) || (data.refreshmentType === 'Monthly' &&  data.date !=='') || (data.refreshmentType === 'Daily'))
     && (data.median !== "" && data.time !== "")){
      this.submitButton = false;
  
    this.spinner.show();
    let body: any = {};

    data.time = parseInt(data.time )
    body.time= data.time + " "+ data.median
    body.median="";
    if(data.refreshmentType === 'Weekly'){
      body.date = ''
    }if(data.refreshmentType === 'Monthly'){
      body.day=''
    }if(data.refreshmentType === 'Daily'){
      body.date = '';
      body.day =''
    }
    body.refreshmentType = data.refreshmentType;
    body.pid = this.selectedPivot?.id
      this.reportService.updatePivotTable(body).subscribe((resp: any) => {
        if (resp.status == 200){
          this.dataForm.reset();
           this.refrshModal.hide();
           this.spinner.hide()
          this.mainService.openDialog(resp?.message);
        }
      },error => {
        this.spinner.hide();
        console.log(error);
      })

    }
    else {
      this.submitButton = true;
      // this.mainService.openDialog('fill all requird data');
    }
  
    // this.reportService.scheduleReport(this.user?.id,this.selectedReport.id,data).
    // subscribe(data =>{
    //   this.spinner.hide();
    //   this.toast.success('Schedule information stored successfully');
    // },
    // (err) => {
    //   this.spinner.hide();
    //   this.toast.error('Something went wrong');
    // })

  // console.log('schedule status', this.dataForm);
    }

}
