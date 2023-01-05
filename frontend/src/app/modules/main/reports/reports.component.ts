import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Modal } from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fadeIn } from 'src/app/animations/animations';
import { createChart, initCharts } from 'src/app/helpers/charts';
import { users } from 'src/app/helpers/data';
import { AuthService } from 'src/app/services/auth.service';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';
import { KeyValue } from '@angular/common';
import { saveAsExcel } from 'src/app/helpers/xlsx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [fadeIn],
})
export class ReportsComponent implements OnInit {
  reportCharts: any[] = [];
  reports: any;
  users: any[] = users;
  // source:any;
  dataForm: FormGroup;
  user: any;
  lasts:any;
  days:any;
  day:any;
  report:any;
  selectedReport: any;
  shareForm: FormGroup;
  currentPage = 0;
  totalPage = -1;
  // dateTime = new Date();
  tabs: any = [
    { key: 'createdByMe', value: 'Created By Me' },
    { key: 'sharedByMe', value: 'Shared By Me' },
    { key: 'sharedToMe', value: 'Shared With Me' },
    { key: 'deletedByMe', value: 'Deleted Reports' },
  ];
  selectedTab: string = 'createdByMe';
  saveAsExcel = saveAsExcel;
  constructor(
    private toast: ToastrService,
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private title: Title
  ) {
    this.title.setTitle('Reports');
  }
  shareModal: Modal;
  @ViewChild('shareModalRef') shareModalRef: ElementRef;

  refrshModal:Modal;
  @ViewChild('refreshModalRef')refreshModalRef:ElementRef;


  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    initCharts();
    this.getReports();
    this.createShareForm();
    this.route.params.subscribe((params) => {
      this.selectedTab = params['tab'];
    });
    this.createdataForm();
    this.lasts = new Array(12).fill(0).map((x, i) => i +1 );
    this.days=["Sunday","Monday", "Tuesday", "Wednesday", 
                  "Thursday", "Friday", "Saturday"];
  }
  selectSource() {
    const source = this.dataForm.get('source')?.value;
    console.log(source)
  }
  getReports() {
    if (this.user?.id && this.selectedTab) {
      this.destroyChart();
      this.spinner.show();
      this.reportsService
        .getUserReports(this.user.id, this.selectedTab)
        .subscribe(
          (res) => {
            this.spinner.hide();
            if (res?.status === 200 && res.data) {
              this.reports = res.data;
              console.log(this.reports,this.selectedTab,"tab")
              setTimeout(() => {
                this.renderCharts();
              }, 500);
            }
          },
          // (err) => {
          //   this.spinner.hide();
          //   console.error(err);
          // }
        );
    }
  }
 
  

  renderCharts() {
    this.reports.forEach((report: any) => {
      // console.log(report.type, report);
      
      if (
        report?.reportData &&
        report?.reportData?.type &&
        report?.reportData?.chartData &&
        !report?.reportData?.chartData.reportData &&
        report?.id
      ) {
        let reportChart = createChart(
          `chart-${report.id}`,
          report.reportData.type.includes('bar')
            ? 'bar'
            : report.reportData.type,
          report.reportData.chartData,
          {
            plugins: {
              title: {
                display: true,
                text: report?.reportData?.title || '',
              },
            },
            ...(!['pie', 'doughnut'].includes(report.reportData.type)
              ? {
                  scales: {
                    x: {
                      ...(report.reportData?.isXCoordTime
                        ? {
                            type: 'time',
                            time: {
                              unit: 'month',
                            },
                          }
                        : {}),
                      stacked: report.reportData.type === 'stacked-bar',
                    },
                    y: {
                      stacked: report.reportData.type === 'stacked-bar',
                    },
                  },
                }
              : {}),
          }
        );
        this.reportCharts.push(reportChart);
      }
    });
  }

  destroyChart() {
    if (this.reportCharts.length) {
      this.reportCharts.forEach((reportChart) => {
        (reportChart as Chart)?.destroy();
      });
      this.reportCharts = [];
    }
  }

  getAllUser() {
    this.spinner.show();
    this.reportsService.getAllUsers(this.user?.id).subscribe(
      (res) => {
        this.spinner.hide();
        if (res?.status === 200 && res?.data) {
          this.users = res.data;
        }
      },
      (err) => {
        this.spinner.hide();
        console.error(err);
      }
    );
  }

  onShare(report: any) {
    this.selectedReport = report;
    this.getAllUser();
    this.shareModal = new Modal(this.shareModalRef.nativeElement, {});
    this.shareModal.show();
    this.createShareForm();
  }
  refreshment(report:any){
    this.selectedReport=report;
    this.refrshModal= new Modal(this.refreshModalRef.nativeElement,{})
    this.refrshModal.show()
  }

  onShareSubmit(sendEmail = false) {
    if (this.shareForm.valid) {
      const data = this.shareForm.value;
      data.reportLink = `/reports/details/${this.selectedReport.id}`;
      data.fromEmail = this.user.email;
      data.toEmail = data.users.map((user: any) => user.email);
      data.users = data.users.map((user: any) => user.id);
      data.reportTitle = this.selectedReport?.reportData?.title || '-';
      data.sendEmail = sendEmail;

      this.spinner.show();
      this.reportsService.shareReport(this.selectedReport.id, data).subscribe(
        (res) => {
          this.spinner.hide();
          this.shareModal.hide();
          this.toast.success('Successfully Shared Report');
        },
        (err) => {
          this.spinner.hide();
          this.toast.error('Something went wrong');
        }
      );
    }
  }

  onDelete(report: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this report?',
      confirmButtonColor: '#0079E6',
      cancelButtonColor: '#ff4747',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.reportsService.deleteUserReports(report.id).subscribe(
          (res) => {
            this.spinner.hide();
            this.toast.success('Successfully Deleted Report!');
            this.getReports();
          },
          (err) => {
            this.spinner.hide();
            this.toast.error('Something went wrong!');
            console.error(err);
          }
        );
      }
    });
  }

  onRestore(report: any) {
    Swal.fire({
      title: 'Are you sure you want to restore this report?',
      confirmButtonColor: '#0079E6',
      cancelButtonColor: '#ff4747',
      showCancelButton: true,
      confirmButtonText: 'Restore',
    }).then((result) => {
      if (result.isConfirmed && this.user?.id) {
        this.spinner.show();
        this.reportsService
          .restoreUserReports(this.user.id, report.id)
          .subscribe(
            (res) => {
              console.log(report.id,"report")
              this.spinner.hide();
              this.toast.success('Successfully Restored Report!');
              this.getReports();
            },
            (err) => {
              this.spinner.hide();
              this.toast.error('Something went wrong!');
              console.error(err);
            }
          );
      }
    });
  }
  onSchdule(){
    const data = this.dataForm.value;
    data.time = parseInt(data.time )
    data.time= data.time + " "+ data.median
    data.median="";
    if(data.refreshmentType === 'Weekly'){
      data.date = ''
    }if(data.refreshmentType === 'Monthly'){
      data.day=''
    }if(data.refreshmentType === 'Daily'){
      data.date = '';
      data.day =''
    }
  
    this.reportsService.scheduleReport(this.user?.id,this.selectedReport.id,data).
    subscribe(data =>{
      this.spinner.hide();
      this.toast.success('Schedule information stored successfully');
    },
    (err) => {
      this.spinner.hide();
      this.toast.error('Something went wrong');
    })

    }
    

  createShareForm() {
    this.shareForm = this.fb.group({
      users: [[], [Validators.required, Validators.maxLength]],
      permission: ['viewer', [Validators.required]],
      sendEmail: false,
    });
  }
  createdataForm(){
    this.dataForm= this.fb.group({
      refreshmentType:[''],
      date:[Validators.required],
      time:[Validators.required],
      day:[''],
      median:['']
      })
  }

  onTabChange(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
      this.router.navigate(['reports', tab]);
      this.getReports();
    }
  }

  downloadAsImage(index: number) {
    const url = (this.reportCharts[index] as Chart).toBase64Image();
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', url);
    downloadLink.download = 'chart';
    downloadLink.click();
  }
  onPermanentlyDelete(report:any) {
    Swal.fire({
      title: 'Are you sure you want to permanently delete this report?',
      confirmButtonColor: '#0079E6',
      cancelButtonColor: '#ff4747',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
    if (result.isConfirmed) {
      this.spinner.show();
      this.reportsService
        .deletePermanentlyUserReports(report.id)
        .subscribe(
          (res) => {
             console.log(res)
            this.spinner.hide();
            this.toast.success('Successfully Deleted The Report Permanently!');
            this.getReports();
          },
          (err) => {
            this.spinner.hide();
            this.toast.error('Something went wrong!');
            console.error(err);
          }
        );
    }
  });
  }
  onSelectPage(page: number){

  }
}
